// Needed for legacy browsers as specified in
// https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { webWidgetStyles } from './webWidgetStyles.js';
import { Frame } from 'component/frame/Frame';
import { authentication } from 'service/authentication';
import { beacon } from 'service/beacon';
import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
import { transitionFactory } from 'service/transitionFactory';
import { http, socketio } from 'service/transport';
import { generateUserCSS } from 'utility/color/styles';
import { getZoomSizingRatio,
  isIE,
  isMobileBrowser,
  setScaleLock } from 'utility/devices';
import { document, getDocumentHost } from 'utility/globals';
import { mouse } from 'utility/mouse';
import { isOnHelpCenterPage } from 'utility/pages';
import { cappedTimeoutCall,
  getPageKeywords } from 'utility/utils';
import { getActiveEmbed } from 'src/redux/modules/base/base-selectors';
import { getChatNotification } from 'src/redux/modules/chat/chat-selectors';
import { setVisitorInfo, chatNotificationDismissed, fetchConversationHistory } from 'src/redux/modules/chat';
import { resetTalkScreen } from 'src/redux/modules/talk';
import { getTicketForms,
  getTicketFields } from 'src/redux/modules/submitTicket';
import { SDK_ACTION_TYPE_PREFIX, JWT_ERROR } from 'constants/chat';

import WebWidget from 'component/webWidget/WebWidget';

// Any external dependencies that are optional must be wrapped in a try...catch
// when being required. This will stop an exception which prevents the Widget
// from loading.
// TODO: Find a DRY solution
const zChat = (() => { try { return require('chat-web-sdk'); } catch (_) {} })();

const webWidgetCSS = `${require('globalCSS')} ${webWidgetStyles}`;

export default function WebWidgetFactory(name) {
  let embed = null;
  let hasManuallySetContextualSuggestions = false;
  let hasAuthenticatedSuccessfully = false;
  let useMouseDistanceContexualSearch = false;
  let contextualSearchOptions = {};
  let cancelTargetHandler = null;
  let resetEmbedOnShow = false;
  let prefix = '';

  if (name) {
    prefix = name + '.';
  }

  const onShowMobile = () => {
    setScaleLock(true);
    setTimeout(() => {
      mediator.channel.broadcast(prefix + '.updateZoom', getZoomSizingRatio());
    }, 0);
  };
  const onShow = () => {
    const rootComponent = getRootComponent();

    if (rootComponent) {
      const { submitTicketForm } = rootComponent.refs;

      if (isMobileBrowser()) {
        onShowMobile();
      }
      if (submitTicketForm) {
        submitTicketForm.resetTicketFormVisibility();
      }
    }
  };
  const onHide = () => {
    const rootComponent = getRootComponent();

    if (rootComponent) {
      if (isMobileBrowser()) {
        setScaleLock(false);
        if (rootComponent.resetState) {
          rootComponent.resetState();
        }
      }
      if (rootComponent.pauseAllVideos) {
        rootComponent.pauseAllVideos();
      }

      if (getActiveEmbed(embed.store.getState()) === 'talk') {
        embed.store.dispatch(resetTalkScreen());
      }
    }
  };
  const onBack = () => {
    getWebWidgetComponent().onBackClick();
  };
  const afterShowAnimate = () => {
    const rootComponent = getRootComponent();

    if (rootComponent && isIE()) {
      if (rootComponent.refs.submitTicketForm) {
        rootComponent.refs.submitTicketForm.focusField();
      }
    }
    if (rootComponent && rootComponent.focusField) {
      rootComponent.focusField();
    }
  };
  const onClose = () => {
    mediator.channel.broadcast(prefix + 'webWidget.onClose');
  };
  const zopimOnNext = () => {
    mediator.channel.broadcast(prefix + 'helpCenterForm.onNextClick');
    hide();
  };

  function create(name, config = {}, reduxStore = {}) {
    let containerStyle;
    let frameStyle = {};
    let frameBodyCss = '';

    const configDefaults = {
      position: 'right',
      hideZendeskLogo: false,
      color: '#659700'
    };
    const talkConfig = config.talk;
    const talkAvailable = !!talkConfig && !settings.get('talk.suppress');
    const helpCenterAvailable = !!config.helpCenterForm && !settings.get('helpCenter.suppress');
    const submitTicketAvailable = !!config.ticketSubmissionForm && !settings.get('contactForm.suppress');
    const chatConfig = config.zopimChat;
    const chatAvailable = !!chatConfig;
    const channelChoice = settings.get('contactOptions').enabled && submitTicketAvailable;
    const submitTicketSettings = submitTicketAvailable
      ? setUpSubmitTicket(config.ticketSubmissionForm, reduxStore)
      : {};
    const helpCenterSettings = helpCenterAvailable || config.ipmAllowed
      ? setUpHelpCenter(config.helpCenterForm)
      : {};
    // if HC is unavailable but IPM requested it, ipmHelpCenterAvailable will be true
    const ipmHelpCenterAvailable = !helpCenterAvailable && config.ipmAllowed;
    const rootConfig = _.omit(config, ['ticketSubmissionForm', 'helpCenterForm', 'zopimChat', 'talk']);
    const globalConfig = _.extend(
      configDefaults,
      submitTicketSettings.config,
      helpCenterSettings.config,
      talkConfig,
      chatConfig,
      rootConfig
    );

    if (chatAvailable) {
      const authentication = settings.getChatAuthSettings();

      setupChat({ ...chatConfig, authentication }, reduxStore, globalConfig.brand);
    }

    if (talkAvailable) {
      setupTalk(talkConfig, reduxStore);
    }

    if (isMobileBrowser()) {
      containerStyle = { width: '100%', minHeight:'100%' };
    } else {
      const margin = settings.get('margin');

      frameStyle = _.extend({}, frameStyle, {
        width: 342,
        marginLeft: margin,
        marginRight: margin
      });
      containerStyle = { width: 342 };
      frameBodyCss = `
        body { padding: 0 7px; }
      `;
    }

    const frameParams = {
      ref: (el) => {embed.instance = el;},
      frameStyle: frameStyle,
      css: webWidgetCSS + frameBodyCss + generateUserCSS(globalConfig.color),
      position: globalConfig.position,
      fullscreenable: true,
      transitions: {
        upClose: transitionFactory.webWidget.upHide(),
        downClose: transitionFactory.webWidget.downHide(),
        close: transitionFactory.webWidget.downHide(),
        downShow: transitionFactory.webWidget.downShow(),
        downHide: transitionFactory.webWidget.downHide(),
        upShow: transitionFactory.webWidget.upShow()
      },
      newChat: chatAvailable,
      store: reduxStore,
      visible: false,
      useBackButton: true,
      onShow,
      name: name,
      afterShowAnimate,
      onHide,
      onClose,
      onBack
    };
    const component = (
      <Frame {...frameParams}>
        <WebWidget
          attachmentSender={submitTicketSettings.attachmentSender}
          channelChoice={channelChoice}
          fullscreen={isMobileBrowser()}
          helpCenterAvailable={helpCenterAvailable}
          helpCenterConfig={helpCenterSettings.config}
          ipmHelpCenterAvailable={ipmHelpCenterAvailable}
          isOnHelpCenterPage={isOnHelpCenterPage()}
          hideZendeskLogo={globalConfig.hideZendeskLogo}
          imagesSender={helpCenterSettings.imagesSenderFn}
          localeFallbacks={settings.get('helpCenter.localeFallbacks')}
          onCancel={submitTicketSettings.onCancel}
          onSubmitted={submitTicketSettings.onSubmitted}
          originalArticleButton={settings.get('helpCenter.originalArticleButton')}
          position={globalConfig.position}
          style={containerStyle}
          subjectEnabled={settings.get('contactForm.subject')}
          ticketFormSettings={settings.get('contactForm.ticketForms')}
          ticketFieldSettings={settings.get('contactForm.fields')}
          submitTicketAvailable={submitTicketAvailable}
          submitTicketConfig={submitTicketSettings.config}
          talkConfig={talkConfig}
          talkAvailable={talkAvailable}
          zendeskHost={http.getZendeskHost()}
          zopimOnNext={zopimOnNext}
          onShowMobile={onShowMobile} />
      </Frame>
    );

    embed = {
      component,
      submitTicketSettings,
      config: {
        global: globalConfig,
        helpCenterForm: helpCenterSettings.config,
        ticketSubmissionForm: submitTicketSettings.config
      },
      embedsAvailable: {
        helpCenterForm: helpCenterAvailable,
        ticketSubmissionForm: submitTicketAvailable,
        chat: chatAvailable,
        talk: talkAvailable
      },
      store: reduxStore
    };

    return this;
  }

  function render() {
    if (embed && embed.instance) {
      throw new Error('WebWidget has already been rendered.');
    }

    const element = getDocumentHost().appendChild(document.createElement('div'));

    ReactDOM.render(embed.component, element);

    setupMediator();
  }

  function hide(options) {
    waitForRootComponent(() => {
      embed.instance.hide(options);
    });
  }

  function setupMediator() {
    mediator.channel.subscribe(prefix + 'webWidget.show', (options = {}) => {
      waitForRootComponent(() => {
        // If the embed is already opened don't try to reset the state with activate
        if (embed.instance.state.visible && options.viaActivate) return;

        // Stop stupid host page scrolling
        // when trying to focus HelpCenter's search field.
        setTimeout(() => {
          getWebWidgetComponent().show(options.viaActivate || resetEmbedOnShow);
          embed.instance.show(options);
          resetEmbedOnShow = false;
        }, 0);

        if (useMouseDistanceContexualSearch && options.viaActivate && embed.config.helpCenterForm) {
          useMouseDistanceContexualSearch = false;

          if (cancelTargetHandler) {
            cancelTargetHandler();
          }

          webWidget.keywordsSearch(contextualSearchOptions);
        }
      });
    });

    mediator.channel.subscribe(prefix + 'webWidget.proactiveChat', (options = {}) => {
      embed.instance.show(options);
      getWebWidgetComponent().showProactiveChat();
    });

    mediator.channel.subscribe(prefix + 'webWidget.hideChatNotification', () => {
      const state = embed.store.getState();
      const { show, proactive } = getChatNotification(state);

      if (show) {
        if (isMobileBrowser() && proactive && getActiveEmbed(state) === '') {
          getWebWidgetComponent().dismissStandaloneChatPopup();
        } else {
          embed.store.dispatch(chatNotificationDismissed());
        }
      }
    });

    mediator.channel.subscribe(prefix + 'webWidget.hide', (options = {}) => {
      hide(options);
    });

    mediator.channel.subscribe(prefix + 'webWidget.zopimChatEnded', () => {
      waitForRootComponent(() => {
        // Reset the active component state
        getWebWidgetComponent().setComponent('');
      });
    });

    mediator.channel.subscribe(prefix + 'webWidget.zopimChatStarted', () => {
      waitForRootComponent(() => {
        if (!embed.instance.state.visible) {
          getWebWidgetComponent().setComponent('zopimChat');
        }
      });
    });

    mediator.channel.subscribe(prefix + 'webWidget.refreshLocale', () => {
      waitForRootComponent(() => {
        const store = embed.store;
        const {
          ticketForms,
          customFields = {} } = embed.submitTicketSettings;

        embed.instance.updateFrameLocale();
        getWebWidgetComponent().forceUpdate();
        if (getRootComponent()) {
          getRootComponent().forceUpdate();
        }

        if (!_.isEmpty(ticketForms)) {
          store.dispatch(getTicketForms(ticketForms, i18n.getLocale()));
        } else if (customFields.ids || customFields.all) {
          store.dispatch(getTicketFields(customFields, i18n.getLocale()));
        }

        embed.instance.getChild().forceUpdate();
      });
    });

    mediator.channel.subscribe(prefix + 'webWidget.update', () => {
      waitForRootComponent(() => {
        embed.instance.getChild().forceUpdate();
      });
    });

    mediator.channel.subscribe(prefix + 'zopimChat.setUser', (user) => {
      waitForRootComponent(() => {
        if (embed.embedsAvailable.chat) {
          // Fallback to empty string because Chat SDK doesn't accept "undefined"
          const { name = '', email = '' } = user;

          embed.store.dispatch(setVisitorInfo({ display_name: name, email })); // eslint-disable-line camelcase
        }
      });
    });

    mediator.channel.subscribe(prefix + 'helpCenterForm.setHelpCenterSuggestions', (options) => {
      waitForRootComponent(() => {
        if (embed.embedsAvailable.helpCenterForm) {
          hasManuallySetContextualSuggestions = true;
          performContextualHelp(options);
        }
      });
    });

    mediator.channel.subscribe(prefix + 'helpCenterForm.isAuthenticated', () => {
      hasAuthenticatedSuccessfully = true;

      waitForRootComponent(() => {
        getWebWidgetComponent().setAuthenticated(hasAuthenticatedSuccessfully);
      });
    });
  }

  function get() {
    return embed;
  }

  function getRootComponent() {
    return getWebWidgetComponent().getRootComponent();
  }

  function getWebWidgetComponent() {
    return embed.instance.getRootComponent();
  }

  function waitForRootComponent(callback) {
    if (embed && embed.instance && getWebWidgetComponent()) {
      callback();
    } else {
      setTimeout(() => {
        waitForRootComponent(callback);
      }, 0);
    }
  }

  function postRender() {
    if (!embed.config.helpCenterForm) return;

    const config = embed.config.helpCenterForm;
    const authSetting = settings.getSupportAuthSettings();

    if (config.contextualHelpEnabled &&
        !hasManuallySetContextualSuggestions &&
        !isOnHelpCenterPage()) {
      const options = { url: true };

      waitForRootComponent(() => performContextualHelp(options));
    }

    if (config.tokensRevokedAt) {
      authentication.revoke(config.tokensRevokedAt);
    }

    if (authSetting) {
      authentication.authenticate(authSetting.jwt);
    }
  }

  function keywordsSearch(options) {
    const contextualSearchFn = () => {
      const helpCenterComponent = getWebWidgetComponent().getHelpCenterComponent();
      const signInNotRequired = embed.config.helpCenterForm.signInRequired === false;
      const isAuthenticated = signInNotRequired || hasAuthenticatedSuccessfully || isOnHelpCenterPage();

      if (isAuthenticated && helpCenterComponent) {
        if (options.url) {
          options.pageKeywords = getPageKeywords();
        }

        helpCenterComponent.contextualSearch(options);

        return true;
      }

      return false;
    };

    cappedTimeoutCall(contextualSearchFn, 500, 20);
  }

  function performContextualHelp(options) {
    contextualSearchOptions = options;

    const onHitFn = (options) => () => {
      keywordsSearch(options);
      useMouseDistanceContexualSearch = false;
    };

    if (!isMobileBrowser() && useMouseDistanceContexualSearch) {
      const launcherElement = document.getElementById('launcher');

      cancelTargetHandler = mouse.target(launcherElement, onHitFn(options));
    } else {
      webWidget.keywordsSearch(options);
    }
  }

  function setUpSubmitTicket(config, store) {
    const submitTicketConfigDefaults = {
      position: 'right',
      customFields: [],
      formTitleKey: 'message',
      attachmentsEnabled: false,
      maxFileCount: 5,
      maxFileSize: 5 * 1024 * 1024, // 5 MB
      ticketForms: [],
      color: '#659700'
    };
    const attachmentsSetting = settings.get('contactForm.attachments');

    config = _.extend({}, submitTicketConfigDefaults, config);

    if (attachmentsSetting === false) {
      config.attachmentsEnabled = false;
    }

    const attachmentSender = (file, doneFn, failFn, progressFn) => {
      const payload = {
        method: 'post',
        path: '/api/v2/uploads',
        file: file,
        callbacks: {
          done: doneFn,
          fail: failFn,
          progress: progressFn
        }
      };

      return http.sendFile(payload);
    };
    const createUserActionPayload = (payload, params) => {
      const body = params.res.body;
      const response = body.request || body.suspended_ticket;

      return _.extend({}, payload, {
        ticketId: response.id,
        email: params.email,
        attachmentsCount: params.attachmentsCount,
        attachmentTypes: params.attachmentTypes,
        contextualSearch: params.contextualSearch
      });
    };
    const onSubmitted = (params) => {
      let userActionPayload = {
        query: params.searchTerm,
        locale: params.searchLocale
      };

      userActionPayload = createUserActionPayload(userActionPayload, params);
      beacon.trackUserAction('submitTicket', 'send', 'ticketSubmissionForm', userActionPayload);
      mediator.channel.broadcast(prefix + 'ticketSubmissionForm.onFormSubmitted');
      resetEmbedOnShow = true;
    };
    const onCancel = () => {
      mediator.channel.broadcast(prefix + 'ticketSubmissionForm.onCancelClick');
    };
    const getTicketFormsFromConfig = _.memoize((config) => {
      const settingTicketForms = settings.get('contactForm.ticketForms');

      if (_.isEmpty(settingTicketForms)) {
        return config.ticketForms;
      }

      return _.chain(settingTicketForms)
        .map((ticketForm) => ticketForm.id)
        .compact()
        .value();
    });

    const { customFields } = config;
    const ticketForms = getTicketFormsFromConfig(config);

    if (!_.isEmpty(ticketForms)) {
      // TODO: Alter this code to return objects with id's once pre-fill is GA'd
      store.dispatch(getTicketForms(ticketForms, i18n.getLocale()));
    } else if (customFields.ids || customFields.all === true) {
      store.dispatch(getTicketFields(customFields, i18n.getLocale()));
      config.customFields = [];
    }

    return {
      config,
      ticketForms,
      customFields,
      attachmentSender,
      onSubmitted,
      onCancel
    };
  }

  function setupChat(config, store, brand) {
    zChat.on('error', (e) => {
      if (_.get(e, 'extra.reason') === JWT_ERROR) {
        _.unset(config, 'authentication');
        setupChat(config, store, brand);
      }
    });

    zChat.init(makeChatConfig(config));

    zChat.setOnFirstReady({
      fetchHistory: () => {
        if (_.get(config, 'authentication.jwtFn')) {
          zChat.addTag(brand);
          store.dispatch(fetchConversationHistory());
        }
      }
    });

    if (brand && !_.get(config, 'authentication.jwtFn')) {
      zChat.addTag(brand);
    }

    zChat.getFirehose().on('data', (data) => {
      let actionType;

      if (data.type === 'history') {
        actionType = `${SDK_ACTION_TYPE_PREFIX}/history/${data.detail.type}`;
      } else {
        actionType = data.detail.type
          ? `${SDK_ACTION_TYPE_PREFIX}/${data.detail.type}`
          : `${SDK_ACTION_TYPE_PREFIX}/${data.type}`;
      }

      store.dispatch({ type: actionType, payload: data });
    });
  }

  function setupTalk(config, store) {
    const nickname = settings.get('talk.nickname') || config.nickname;
    const socket = socketio.connect(config.serviceUrl, nickname);

    socketio.mapEventsToActions(socket, store);
  }

  function makeChatConfig(config) {
    const chatConfigDefaults = {
      position: 'right',
      color: '#659700',
      zopimId: 'xxx'
    };

    config = _.extend({}, chatConfigDefaults, config);

    /* eslint-disable camelcase */
    const jwtFn = _.get(config, 'authentication.jwtFn');
    const authentication = jwtFn ? { jwt_fn: jwtFn } : null;

    return _.omitBy({
      account_key: config.zopimId,
      override_proxy: config.overrideProxy,
      authentication
    }, _.isNil);
    /* eslint-enable camelcase */
  }

  function setUpHelpCenter(config) {
    const helpCenterConfigDefaults = {
      position: 'right',
      contextualHelpEnabled: false,
      buttonLabelKey: 'message',
      formTitleKey: 'help',
      signInRequired: false,
      enableMouseDrivenContextualHelp: false,
      color: '#659700'
    };

    config = _.extend({}, helpCenterConfigDefaults, config);

    useMouseDistanceContexualSearch = config.enableMouseDrivenContextualHelp;

    return {
      config
    };
  }

  const webWidget = {
    create,
    render,
    get,
    postRender,
    keywordsSearch,
    waitForRootComponent
  };

  return webWidget;
}

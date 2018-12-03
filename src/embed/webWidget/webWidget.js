// Needed for legacy browsers as specified in
// https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Provider } from 'react-redux';

import { webWidgetStyles } from './webWidgetStyles.js';
import Frame from 'component/frame/Frame';
import { beacon } from 'service/beacon';
import { i18n } from 'service/i18n';
import { logging } from 'service/logging';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
import { http } from 'service/transport';
import { store } from 'service/persistence';
import { generateUserWidgetCSS } from 'utility/color/styles';
import { getZoomSizingRatio,
  isIE,
  isMobileBrowser,
  setScaleLock } from 'utility/devices';
import { document, getDocumentHost, win, isPopout } from 'utility/globals';
import { isOnHelpCenterPage } from 'utility/pages';
import { getActiveEmbed } from 'src/redux/modules/base/base-selectors';
import { getChatNotification, getStandaloneMobileNotificationVisible } from 'src/redux/modules/chat/chat-selectors';
import { setVisitorInfo,
  chatNotificationDismissed,
  fetchConversationHistory,
  handleChatVendorLoaded,
  setChatHistoryHandler } from 'src/redux/modules/chat';
import { resetTalkScreen } from 'src/redux/modules/talk';
import { getTicketForms,
  getTicketFields } from 'src/redux/modules/submitTicket';
import { SDK_ACTION_TYPE_PREFIX, JWT_ERROR } from 'constants/chat';
import { AUTHENTICATION_STARTED, AUTHENTICATION_FAILED } from 'src/redux/modules/chat/chat-action-types';
import { authenticate, revokeToken } from 'src/redux/modules/base';
import WebWidget from 'component/webWidget/WebWidget';
import { loadTalkVendors } from 'src/redux/modules/talk';
import { setScrollKiller } from 'utility/scrollHacks';
import { nameValid, emailValid } from 'src/util/utils';
import zopimApi from 'service/api/zopimApi';

const webWidgetCSS = `${require('globalCSS')} ${webWidgetStyles}`;

export default function WebWidgetFactory(name) {
  let embed = null;
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
    const rootComponent = getActiveComponent();

    getWebWidgetComponent().show();

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
    const rootComponent = getActiveComponent();

    mediator.channel.broadcast('webWidget.onClose');

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
    const rootComponent = getActiveComponent();

    if (rootComponent && isIE()) {
      if (rootComponent.refs.submitTicketForm) {
        rootComponent.refs.submitTicketForm.focusField();
      }
    }
    if (rootComponent && rootComponent.focusField) {
      rootComponent.focusField();
    }
  };
  const zopimOnNext = () => {
    mediator.channel.broadcast(prefix + 'helpCenterForm.onNextClick');
    hide();
    if (isMobileBrowser()) {
      setScrollKiller(false);
    }
  };

  function create(name, config = {}, reduxStore = {}) {
    let containerStyle;
    let frameBodyCss = '';
    const popout = isPopout(),
      isMobile = isMobileBrowser();

    const configDefaults = {
      position: 'right',
      hideZendeskLogo: false,
      color: '#659700'
    };
    const talkConfig = config.talk;
    const talkAvailable = !!talkConfig && !settings.get('talk.suppress') &&
      !!_.trim(settings.get('talk.nickname') || talkConfig.nickname);
    const helpCenterAvailable = !!config.helpCenterForm && !settings.get('helpCenter.suppress');
    const submitTicketAvailable = !!config.ticketSubmissionForm && !settings.get('contactForm.suppress');
    const chatConfig = config.zopimChat;
    const chatAvailable = !!chatConfig;
    const submitTicketSettings = (submitTicketAvailable)
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
      helpCenterSettings.config,
      submitTicketSettings.config,
      talkConfig,
      chatConfig,
      rootConfig
    );

    if (chatAvailable) {
      const authentication = settings.getChatAuthSettings();
      const { brandCount, brand } = globalConfig;
      let brandName;

      if (brandCount > 1 || brandCount === undefined) {
        brandName = brand;
      }

      setupChat({ ...chatConfig, authentication }, reduxStore, brandName);
    }

    if (talkAvailable) {
      setupTalk(talkConfig, reduxStore);
    }

    if (isMobile || popout) {
      containerStyle = { width: '100%', minHeight:'100%', maxHeight:'100%'  };
    } else {
      containerStyle = { width: 342 };
      frameBodyCss = `
        body { padding: 0 7px; }
      `;
    }

    if (popout) {
      containerStyle = {
        ...containerStyle,
        maxWidth: '650px',
        height: '100%'
      };
    }

    const frameParams = {
      ref: (el) => {embed.instance = el.getWrappedInstance();},
      css: webWidgetCSS + frameBodyCss,
      generateUserCSS: generateUserWidgetCSS,
      position: globalConfig.position,
      fullscreenable: true,
      fullscreen: popout,
      isMobile: isMobile,
      newChat: chatAvailable,
      store: reduxStore,
      visible: false,
      useBackButton: !popout,
      hideCloseButton: popout,
      onShow,
      name: name,
      afterShowAnimate,
      onHide,
      onBack,
      title: i18n.t('embeddable_framework.web_widget.frame.title')
    };
    const component = (
      <Provider store={reduxStore}>
        <Frame {...frameParams}>
          <WebWidget
            attachmentSender={submitTicketSettings.attachmentSender}
            fullscreen={popout}
            isMobile={isMobile}
            helpCenterConfig={helpCenterSettings.config}
            ipmHelpCenterAvailable={ipmHelpCenterAvailable}
            isOnHelpCenterPage={isOnHelpCenterPage()}
            imagesSender={helpCenterSettings.imagesSenderFn}
            localeFallbacks={settings.get('helpCenter.localeFallbacks')}
            onSubmitted={submitTicketSettings.onSubmitted}
            originalArticleButton={settings.get('helpCenter.originalArticleButton')}
            position={globalConfig.position}
            style={containerStyle}
            subjectEnabled={settings.get('contactForm.subject')}
            ticketFormSettings={settings.get('contactForm.ticketForms')}
            ticketFieldSettings={settings.get('contactForm.fields')}
            submitTicketConfig={submitTicketSettings.config}
            talkConfig={talkConfig}
            talkAvailable={talkAvailable}
            zopimOnNext={zopimOnNext}
            chatId={_.get(chatConfig, 'zopimId')}
            onShowMobile={onShowMobile}/>
        </Frame>
      </Provider>
    );

    embed = {
      component,
      submitTicketSettings,
      config: {
        global: globalConfig,
        helpCenterForm: helpCenterSettings.config,
        ticketSubmissionForm: submitTicketSettings.config
      },
      embedsAvailable: { chat: chatAvailable },
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
    mediator.channel.subscribe(prefix + 'webWidget.proactiveChat', (options = {}) => {
      embed.instance.show(options);
      getWebWidgetComponent().showProactiveChat();
    });

    mediator.channel.subscribe(prefix + 'webWidget.clearAttachments', () => {
      const submitTicket = getWebWidgetComponent().getSubmitTicketComponent();

      if (submitTicket) {
        submitTicket.clearAttachments();
      }
    });

    mediator.channel.subscribe(prefix + 'webWidget.hideChatNotification', () => {
      const state = embed.store.getState();
      const { show } = getChatNotification(state);

      if (getStandaloneMobileNotificationVisible(state)) {
        getWebWidgetComponent().dismissStandaloneChatPopup();
      } else if (show) {
        embed.store.dispatch(chatNotificationDismissed());
      }
    });

    mediator.channel.subscribe(prefix + 'webWidget.zopimChatStarted', () => {
      waitForRootComponent(() => {
        if (!embed.instance.props.visible) {
          getWebWidgetComponent().setComponent('zopimChat');
        }
      });
    });

    mediator.channel.subscribe(prefix + 'webWidget.updateSettings', () => {
      waitForRootComponent(() => {
        embed.instance.forceUpdateWorld();
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
        if (getActiveComponent()) {
          getActiveComponent().forceUpdate();
        }

        if (!_.isEmpty(ticketForms)) {
          store.dispatch(getTicketForms(ticketForms, i18n.getLocale()));
        } else if (customFields.ids || customFields.all) {
          store.dispatch(getTicketFields(customFields, i18n.getLocale()));
        }

        embed.instance.getChild().forceUpdate();
      });
    });

    mediator.channel.subscribe(prefix + 'zopimChat.setUser', (user) => {
      waitForRootComponent(() => {
        if (embed.embedsAvailable.chat) {
          // Fallback to null or empty string because Chat SDK doesn't accept "undefined" or "null"
          const validUser = {};

          if (nameValid(user.name)) validUser.display_name = user.name; // eslint-disable-line camelcase
          if (emailValid(user.email)) validUser.email = user.email;

          embed.store.dispatch(setVisitorInfo(validUser));
        }
      });
    });
  }

  function get() {
    return embed;
  }

  function getActiveComponent() {
    return getWebWidgetComponent().getActiveComponent();
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

    if (config.tokensRevokedAt) {
      embed.store.dispatch(revokeToken(config.tokensRevokedAt));
    }

    if (authSetting) {
      embed.store.dispatch(authenticate(authSetting.jwt));
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
      onSubmitted
    };
  }

  function setupChat(config, store, brand) {
    const onSuccess = (zChat, slider) => {
      store.dispatch(handleChatVendorLoaded({ zChat, slider: slider.default }));
      store.dispatch(setChatHistoryHandler());

      zChat.on('error', (e) => {
        if (_.get(e, 'extra.reason') === JWT_ERROR) {
          _.unset(config, 'authentication');
          store.dispatch({
            type: AUTHENTICATION_FAILED
          });
          setupChat(config, store, brand);
        }
      });

      if (config.authentication) {
        store.dispatch({
          type: AUTHENTICATION_STARTED
        });
      }
      zChat.init(makeChatConfig(config));
      zopimApi.handleZopimQueue(win);

      zChat.setOnFirstReady({
        fetchHistory: () => {
          if (_.get(config, 'authentication.jwtFn')) {
            if (brand) zChat.addTag(brand);
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
    };
    const onFailure = (err) => {
      logging.error(err);
    };

    Promise.all([import('chat-web-sdk'), import('react-slick')])
      .then((arr)=> onSuccess(...arr))
      .catch(onFailure);
  }

  function setupTalk(config, store) {
    store.dispatch(loadTalkVendors(
      [import('socket.io-client'), import('libphonenumber-js')],
      config.serviceUrl,
      settings.get('talk.nickname') || config.nickname
    ));
  }

  function makeChatConfig(config) {
    /* eslint-disable camelcase */
    const jwtFn = _.get(config, 'authentication.jwtFn');
    const authentication = jwtFn ? { jwt_fn: jwtFn } : null;

    return _.omitBy({
      account_key: store.get('chatAccountKey') || config.zopimId,
      override_proxy: store.get('chatOverrideProxy') || config.overrideProxy,
      authentication,
      activity_window: win
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
      color: '#659700'
    };

    config = _.extend({}, helpCenterConfigDefaults, config);

    return {
      config
    };
  }

  const webWidget = {
    create,
    render,
    get,
    postRender,
    waitForRootComponent
  };

  return webWidget;
}

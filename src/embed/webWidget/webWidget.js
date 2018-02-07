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
import { generateUserCSS } from 'utility/color';
import { getZoomSizingRatio,
         isIE,
         isMobileBrowser,
         setScaleLock } from 'utility/devices';
import { document,
         getDocumentHost,
         win } from 'utility/globals';
import { mouse } from 'utility/mouse';
import { isOnHelpCenterPage } from 'utility/pages';
import { cappedTimeoutCall,
         getPageKeywords } from 'utility/utils';
import { getActiveEmbed } from 'src/redux/modules/base/base-selectors';
import { setVisitorInfo } from 'src/redux/modules/chat';
import { resetTalkScreen } from 'src/redux/modules/talk';

import WebWidget from 'component/webWidget/WebWidget';

// Any external dependencies that are optional must be wrapped in a try...catch
// when being required. This will stop an exception which prevents the Widget
// from loading.
// TODO: Find a DRY solution
const zChat = (() => { try { return require('chat-web-sdk'); } catch (_) {} })();

const webWidgetCSS = `${require('globalCSS')} ${webWidgetStyles}`;

let embed = null;
let hasManuallySetContextualSuggestions = false;
let hasAuthenticatedSuccessfully = false;
let useMouseDistanceContexualSearch = false;
let contextualSearchOptions = {};
let cancelTargetHandler = null;
let resetEmbedOnShow = false;

const getWithSpinner = (path, locale, doneFn) => {
  const httpData = {
    method: 'get',
    path,
    timeout: 20000,
    locale,
    callbacks: {
      done(res) { doneFn(JSON.parse(res.text)); },
      fail() { getWebWidgetComponent().getSubmitTicketComponent().setLoading(false); }
    }
  };

  waitForRootComponent(() => {
    getWebWidgetComponent().getSubmitTicketComponent().setLoading(true);

    // For setTimeout and invocation of waitForRootComponent,
    // defer and wait for rootComponent before processing statements
    // in order execute after setLoading is completed
    setTimeout(() => {
      http.get(httpData, false);
    }, 0);
  });
};
const showCloseButton = (show = true) => {
  embed.instance.getChild().showCloseButton(show);
};
const onShow = () => {
  const rootComponent = getRootComponent();

  if (rootComponent) {
    const { submitTicketForm } = rootComponent.refs;

    if (isMobileBrowser()) {
      setScaleLock(true);
      setTimeout(() => {
        mediator.channel.broadcast('.updateZoom', getZoomSizingRatio());
      }, 0);
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
    if (rootComponent.clearNotification) {
      rootComponent.clearNotification();
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
  mediator.channel.broadcast('webWidget.onClose');
};
const zopimOnNext = () => {
  mediator.channel.broadcast('helpCenterForm.onNextClick');
  hide();
};

function create(name, config = {}, reduxStore = {}) {
  let containerStyle;
  let frameStyle = {};

  const configDefaults = {
    position: 'right',
    hideZendeskLogo: false,
    color: '#659700'
  };
  const talkConfig = config.talk;
  const talkAvailable = !!talkConfig && !settings.get('talk.suppress');
  const helpCenterAvailable = !!config.helpCenterForm && !settings.get('helpCenter.suppress');
  const submitTicketAvailable = !!config.ticketSubmissionForm && !settings.get('contactForm.suppress');
  const chatAvailable = !!config.zopimChat;
  const channelChoice = settings.get('contactOptions').enabled && submitTicketAvailable;
  const submitTicketSettings = submitTicketAvailable
                             ? setUpSubmitTicket(config.ticketSubmissionForm)
                             : {};
  const helpCenterSettings = helpCenterAvailable
                           ? setUpHelpCenter(config.helpCenterForm)
                           : {};
  const rootConfig = _.omit(config, ['ticketSubmissionForm', 'helpCenterForm', 'zopimChat', 'talk']);
  const globalConfig = _.extend(
    configDefaults,
    submitTicketSettings.config,
    helpCenterSettings.config,
    talkConfig,
    rootConfig
  );
  const zendeskSubdomain = http.getZendeskSubdomain();

  if (chatAvailable) {
    setupChat(config.zopimChat, reduxStore);
  }

  if (talkAvailable) {
    setupTalk(zendeskSubdomain, talkConfig, reduxStore);
  }

  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    const margin = settings.get('margin');

    frameStyle = _.extend({}, frameStyle, {
      width: 342,
      marginLeft: margin,
      marginRight: margin
    });
    containerStyle = { width: 342 };
  }

  const frameParams = {
    ref: (el) => {embed.instance = el;},
    frameStyle: frameStyle,
    css: webWidgetCSS + generateUserCSS(globalConfig.color),
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
    newDesign: config.newDesign,
    newChat: !!config.zopimChat,
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
        newDesign={config.newDesign}
        fullscreen={isMobileBrowser()}
        helpCenterAvailable={helpCenterAvailable}
        helpCenterConfig={helpCenterSettings.config}
        isOnHelpCenterPage={isOnHelpCenterPage()}
        hideZendeskLogo={globalConfig.hideZendeskLogo}
        imagesSender={helpCenterSettings.imagesSenderFn}
        localeFallbacks={settings.get('helpCenter.localeFallbacks')}
        onCancel={submitTicketSettings.onCancel}
        onSubmitted={submitTicketSettings.onSubmitted}
        originalArticleButton={settings.get('helpCenter.originalArticleButton')}
        position={globalConfig.position}
        showCloseButton={showCloseButton}
        style={containerStyle}
        subjectEnabled={settings.get('contactForm.subject')}
        tags={settings.get('contactForm.tags')}
        ticketFormSettings={settings.get('contactForm.ticketForms')}
        ticketFieldSettings={settings.get('contactForm.fields')}
        submitTicketAvailable={submitTicketAvailable}
        submitTicketConfig={submitTicketSettings.config}
        submitTicketSender={submitTicketSettings.submitTicketSender}
        talkConfig={talkConfig}
        talkAvailable={talkAvailable}
        viaId={settings.get('viaId')}
        zendeskHost={http.getZendeskHost()}
        zendeskSubdomain={zendeskSubdomain}
        zopimOnNext={zopimOnNext} />
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
    throw new Error(`WebWidget has already been rendered.`);
  }

  const element = getDocumentHost().appendChild(document.createElement('div'));

  ReactDOM.render(embed.component, element);

  setupMediator();
}

function hide(options) {
  waitForRootComponent(() => {
    const rootComponent = getRootComponent();

    embed.instance.hide(options);

    if (rootComponent && rootComponent.state && rootComponent.state.showNotification) {
      rootComponent.clearNotification();
    }
  });
}

function setupMediator() {
  mediator.channel.subscribe('webWidget.show', (options = {}) => {
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

  mediator.channel.subscribe('webWidget.hide', (options = {}) => {
    hide(options);
  });

  mediator.channel.subscribe('webWidget.zopimChatEnded', () => {
    waitForRootComponent(() => {
      // Reset the active component state
      getWebWidgetComponent().setComponent('');
    });
  });

  mediator.channel.subscribe('webWidget.zopimChatStarted', () => {
    waitForRootComponent(() => {
      if (!embed.instance.state.visible) {
        getWebWidgetComponent().setComponent('zopimChat');
      }
    });
  });

  mediator.channel.subscribe('webWidget.refreshLocale', () => {
    waitForRootComponent(() => {
      const {
        ticketForms,
        customFields = {},
        loadTicketForms,
        loadTicketFields } = embed.submitTicketSettings;

      embed.instance.updateFrameLocale();
      getWebWidgetComponent().forceUpdate();
      if (getRootComponent()) {
        getRootComponent().forceUpdate();
      }

      if (!_.isEmpty(ticketForms)) {
        loadTicketForms(ticketForms, i18n.getLocale());
      } else if (customFields.ids || customFields.all) {
        loadTicketFields(customFields, i18n.getLocale());
      }

      embed.instance.getChild().forceUpdate();
    });
  });

  mediator.channel.subscribe('webWidget.update', () => {
    waitForRootComponent(() => {
      embed.instance.getChild().forceUpdate();
    });
  });

  mediator.channel.subscribe('zopimChat.setUser', (user) => {
    waitForRootComponent(() => {
      if (embed.embedsAvailable.chat) {
        const { name, email } = user;

        embed.store.dispatch(setVisitorInfo({ display_name: name, email })); // eslint-disable-line camelcase
      }
    });
  });

  mediator.channel.subscribe('helpCenterForm.setHelpCenterSuggestions', (options) => {
    waitForRootComponent(() => {
      if (embed.embedsAvailable.helpCenterForm) {
        hasManuallySetContextualSuggestions = true;
        performContextualHelp(options);
      }
    });
  });

  mediator.channel.subscribe('helpCenterForm.isAuthenticated', () => {
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
  const authSetting = settings.get('authenticate');

  if (config.contextualHelpEnabled &&
      !hasManuallySetContextualSuggestions &&
      !isOnHelpCenterPage()) {
    const options = { url: true };

    waitForRootComponent(() => performContextualHelp(options));
  }

  if (config.tokensRevokedAt) {
    authentication.revoke(config.tokensRevokedAt);
  }

  if (authSetting && authSetting.jwt) {
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

function setUpSubmitTicket(config) {
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

  const submitTicketSender = (params, doneFn, failFn) => {
    const payload = {
      method: 'post',
      path: '/api/v2/requests',
      params: params,
      callbacks: {
        done: doneFn,
        fail: failFn
      }
    };

    http.send(payload);
  };
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
      attachmentTypes: params.attachmentTypes
    });
  };
  const onSubmitted = (params) => {
    let userActionPayload = {
      query: params.searchTerm,
      locale: params.searchLocale
    };

    userActionPayload = createUserActionPayload(userActionPayload, params);
    beacon.trackUserAction('submitTicket', 'send', 'ticketSubmissionForm', userActionPayload);
    mediator.channel.broadcast('ticketSubmissionForm.onFormSubmitted');
    resetEmbedOnShow = true;
  };
  const onCancel = () => {
    mediator.channel.broadcast('ticketSubmissionForm.onCancelClick');
  };
  const getTicketForms = _.memoize((config) => {
    const settingTicketForms = settings.get('contactForm.ticketForms');

    if (_.isEmpty(settingTicketForms)) {
      return config.ticketForms;
    }

    return _.chain(settingTicketForms)
            .map((ticketForm) => ticketForm.id)
            .compact()
            .value();
  });
  const loadTicketForms = (ticketForms, locale) => {
    const ticketFormIds = _.toString(ticketForms);
    const onDone = (res) => getWebWidgetComponent().getSubmitTicketComponent().updateTicketForms(res);
    const path = `/api/v2/ticket_forms/show_many.json?ids=${ticketFormIds}&include=ticket_fields`;

    getWithSpinner(path, locale, onDone);
  };
  const loadTicketFields = (customFields, locale) => {
    const onDone = (res) => getWebWidgetComponent().getSubmitTicketComponent().updateTicketFields(res);
    const pathIds = customFields.all ? '' : `field_ids=${_.toString(customFields.ids)}&`;
    const path = `/embeddable/ticket_fields?${pathIds}locale=${locale}`;

    getWithSpinner(path, locale, onDone);
  };

  const { customFields } = config;
  const ticketForms = getTicketForms(config);

  if (!_.isEmpty(ticketForms)) {
    // TODO: Alter this code to return objects with id's once pre-fill is GA'd
    loadTicketForms(ticketForms, i18n.getLocale());
  } else if (customFields.ids || customFields.all === true) {
    loadTicketFields(customFields, i18n.getLocale());
    config.customFields = [];
  } else {
    setTimeout(() => {
      waitForRootComponent(() => {
        const submitTicketForm = getWebWidgetComponent().getSubmitTicketComponent();

        if (submitTicketForm) {
          submitTicketForm.updateContactForm();
        }
      });
    }, 0);
  }

  return {
    config,
    ticketForms,
    customFields,
    loadTicketForms,
    loadTicketFields,
    submitTicketSender,
    attachmentSender,
    onSubmitted,
    onCancel
  };
}

function setupChat(config, store) {
  win.zChat = zChat;

  zChat.init(makeChatConfig(config));

  zChat.getFirehose().on('data', (data) => {
    const actionType = data.detail.type ? `websdk/${data.detail.type}` : `websdk/${data.type}`;

    store.dispatch({ type: actionType, payload: data });
  });
}

function setupTalk(zendeskSubdomain, config, store) {
  const keyword = settings.get('talk.keyword') || config.keyword;
  const socket = socketio.connect(config.serviceUrl, zendeskSubdomain, keyword);

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
  const overrideProxyObject = config.overrideProxy
                            ? { override_proxy: config.overrideProxy }
                            : {};

  return _.extend({}, { account_key: config.zopimId }, overrideProxyObject);
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

export const webWidget = {
  create: create,
  render: render,
  get: get,
  postRender: postRender,
  keywordsSearch: keywordsSearch,

  // Exported for testing.
  waitForRootComponent
};

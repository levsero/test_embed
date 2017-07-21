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
import { transport } from 'service/transport';
import { generateUserCSS } from 'utility/color';
import { getZoomSizingRatio,
         isIE,
         isMobileBrowser,
         setScaleLock } from 'utility/devices';
import { document,
         getDocumentHost,
         location,
         win } from 'utility/globals';
import { mouse } from 'utility/mouse';
import { isOnHelpCenterPage,
         isOnHostMappedDomain } from 'utility/pages';
import { cappedTimeoutCall,
         getPageKeywords } from 'utility/utils';
import { updateZopimOnline } from 'src/redux/modules/base';

import WebWidget from 'component/webWidget/WebWidget';
import zChat from 'vendor/web-sdk';

const webWidgetCSS = `${require('./webWidget.scss')} ${webWidgetStyles}`;

let embed = null;
let hasManuallySetContextualSuggestions = false;
let hasAuthenticatedSuccessfully = false;
let useMouseDistanceContexualSearch = false;
let contextualSearchOptions = {};
let cancelTargetHandler = null;

const getWithSpinner = (path, locale, doneFn) => {
  const transportData = {
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
      transport.get(transportData, false);
    }, 0);
  });
};
const showBackButton = (show = true) => {
  embed.instance.getChild().showBackButton(show);
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
    } else {
      if (submitTicketForm) {
        submitTicketForm.focusField();
      } else if (rootComponent.focusField) {
        rootComponent.focusField();
      }
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
    if (rootComponent.backtrackSearch) {
      rootComponent.backtrackSearch();
    }
    if (rootComponent.pauseAllVideos) {
      rootComponent.pauseAllVideos();
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
    if (rootComponent.focusField) {
      rootComponent.focusField();
    }
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
    disableAutoComplete: false,
    color: '#659700'
  };
  const helpCenterAvailable = !!config.helpCenterForm && !settings.get('helpCenter.suppress');
  const submitTicketAvailable = !!config.ticketSubmissionForm && !settings.get('contactForm.suppress');
  const chatAvailable = !!config.zopimChat && !settings.get('chat.suppress');
  const channelChoice = settings.get('contactOptions').enabled && submitTicketAvailable;
  const submitTicketSettings = submitTicketAvailable
                             ? setUpSubmitTicket(config.ticketSubmissionForm)
                             : {};
  const helpCenterSettings = helpCenterAvailable
                           ? setUpHelpCenter(config.helpCenterForm)
                           : {};
  const rootConfig = _.omit(config, ['ticketSubmissionForm', 'helpCenterForm', 'zopimChat']);
  const globalConfig = _.extend(
    configDefaults,
    submitTicketSettings.config,
    helpCenterSettings.config,
    rootConfig
  );

  if (chatAvailable) {
    setUpChat(config.zopimChat, reduxStore);
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
    store: reduxStore,
    visible: false,
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
        contextualSearchSender={helpCenterSettings.contextualSearchSender}
        disableAutoComplete={globalConfig.disableAutoComplete}
        fullscreen={isMobileBrowser()}
        helpCenterAvailable={helpCenterAvailable}
        helpCenterConfig={helpCenterSettings.config}
        hideZendeskLogo={globalConfig.hideZendeskLogo}
        imagesSender={helpCenterSettings.imagesSenderFn}
        localeFallbacks={settings.get('helpCenter.localeFallbacks')}
        onArticleClick={helpCenterSettings.onArticleClick}
        onCancel={submitTicketSettings.onCancel}
        onSearch={helpCenterSettings.onSearch}
        onSubmitted={submitTicketSettings.onSubmitted}
        originalArticleButton={settings.get('helpCenter.originalArticleButton')}
        position={globalConfig.position}
        searchSender={helpCenterSettings.searchSender}
        showBackButton={showBackButton}
        showCloseButton={showCloseButton}
        style={containerStyle}
        subjectEnabled={settings.get('contactForm.subject')}
        tags={settings.get('contactForm.tags')}
        ticketFormSettings={settings.get('contactForm.ticketForms')}
        ticketFieldSettings={settings.get('contactForm.fields')}
        submitTicketAvailable={submitTicketAvailable}
        submitTicketConfig={submitTicketSettings.config}
        submitTicketSender={submitTicketSettings.submitTicketSender}
        viaId={settings.get('viaId')}
        zendeskHost={transport.getZendeskHost()}
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
      chat: chatAvailable
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

  embed.instance = ReactDOM.render(embed.component, element);

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
      // Stop stupid host page scrolling
      // when trying to focus HelpCenter's search field.
      setTimeout(() => {
        getWebWidgetComponent().show();
        embed.instance.show(options);
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

  mediator.channel.subscribe('webWidget.setZopimOnline', (online) => {
    waitForRootComponent(() => {
      embed.store.dispatch(updateZopimOnline(online));
    });
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

      if (!_.isEmpty(ticketForms)) {
        loadTicketForms(ticketForms, i18n.getLocale());
      } else if (customFields.ids || customFields.all) {
        loadTicketFields(customFields, i18n.getLocale());
      }

      embed.instance.getChild().forceUpdate();
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.setLastSearch', (params) => {
    waitForRootComponent(() => {
      const submitTicket = getWebWidgetComponent().getSubmitTicketComponent();

      if (submitTicket) {
        submitTicket.setState(_.pick(params, ['searchTerm', 'searchLocale']));
      }
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.update', () => {
    waitForRootComponent(() => {
      embed.instance.getChild().forceUpdate();
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.prefill', (user) => {
    waitForRootComponent(() => {
      const submitTicketForm = getWebWidgetComponent().getSubmitTicketComponent();
      const formData = _.pickBy(_.pick(user, ['name', 'email']), _.isString);

      if (submitTicketForm) {
        submitTicketForm.setState({
          formState: _.extend({}, submitTicketForm.state.formState, formData)
        });
      }
    });
  });

  mediator.channel.subscribe('zopimChat.setUser', (user) => {
    waitForRootComponent(() => {
      if (embed.embedsAvailable.chat) {
        const chat = getWebWidgetComponent().getChatComponent();

        chat.updateUser(_.pick(user, ['name', 'email']));
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
  });

  mediator.channel.subscribe('webWidget.activate', () => {
    if (embed.instance.state.visible) return;

    waitForRootComponent(() => {
      getWebWidgetComponent().show(true);
      embed.instance.show();
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
    const isAuthenticated = embed.config.helpCenterForm.signInRequired === false || hasAuthenticatedSuccessfully;

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

    transport.send(payload);
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

    return transport.sendFile(payload);
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

function setUpChat(config, store) {
  win.zChat = zChat;

  const chatConfigDefaults = {
    position: 'right',
    color: '#659700',
    zopimId: 'xxx'
  };

  config = _.extend({}, chatConfigDefaults, config);

  zChat.init({ account_key: config.zopimId }); // eslint-disable-line camelcase

  zChat.getFirehose().on('data', (data) => {
    const actionType = data.detail.type ? `websdk/${data.detail.type}` : `websdk/${data.type}`;

    store.dispatch({ type: actionType, payload: data });
  });
}

function setUpHelpCenter(config) {
  const viewMoreEnabled = !!settings.get('helpCenter.viewMore');
  const helpCenterConfigDefaults = {
    position: 'right',
    contextualHelpEnabled: false,
    buttonLabelKey: 'message',
    formTitleKey: 'help',
    signInRequired: false,
    enableMouseDrivenContextualHelp: false,
    color: '#659700'
  };

  const onArticleClick = (trackPayload) => {
    beacon.trackUserAction('helpCenter', 'click', 'helpCenterForm', trackPayload);
  };
  const onSearch = (params) => {
    beacon.trackUserAction('helpCenter', 'search', 'helpCenterForm', params.searchTerm);
    mediator.channel.broadcast('helpCenterForm.onSearch', params);
  };
  const senderPayload = (url) => (query, doneFn, failFn) => {
    const token = authentication.getToken();
    const forceHttp = isOnHostMappedDomain() && location.protocol === 'http:';
    const queryParams = _.extend(query, settings.get('helpCenter.filter'));

    return {
      method: 'get',
      forceHttp: forceHttp,
      path: url,
      query: queryParams,
      authorization: token ? `Bearer ${token}` : '',
      callbacks: {
        done: doneFn,
        fail: failFn
      }
    };
  };
  const searchSenderFn = (url) => (query, doneFn, failFn) => {
    const payload = senderPayload(url)(query, doneFn, failFn);

    transport.send(payload);
  };
  const imagesSenderFn = (url, doneFn) => {
    const payload = senderPayload(url)(null, doneFn);

    transport.getImage(payload);
  };

  config = _.extend({}, helpCenterConfigDefaults, { viewMoreEnabled }, config);

  useMouseDistanceContexualSearch = config.enableMouseDrivenContextualHelp;

  const contextualSearchSender = searchSenderFn('/api/v2/help_center/articles/embeddable_search.json');
  const searchSender = searchSenderFn('/api/v2/help_center/search.json');

  return {
    config,
    onArticleClick,
    onSearch,
    searchSender,
    imagesSenderFn,
    contextualSearchSender
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

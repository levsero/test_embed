import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { webWidgetStyles } from './webWidgetStyles.js';
import { frameFactory } from 'embed/frameFactory';
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
import { cappedIntervalCall,
         getPageKeywords } from 'utility/utils';

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
      fail() { getRootComponent().setLoading(false); }
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

function create(name, config = {}, reduxStore = {}) {
  let containerStyle;
  let frameStyle = {};

  const configDefaults = {
    position: 'right',
    hideZendeskLogo: false,
    expandable: false,
    color: '#659700'
  };
  const helpCenterAvailable = !!config.helpCenterForm;
  const submitTicketAvailable = !!config.ticketSubmissionForm;
  const chatAvailable = !!config.zopimChat;
  const submitTicketSettings = submitTicketAvailable
                             ? setUpSubmitTicket(config.ticketSubmissionForm)
                             : {};
  const helpCenterSettings = helpCenterAvailable
                           ? setUpHelpCenter(config.helpCenterForm)
                           : {};
  const globalConfig = _.extend(configDefaults, helpCenterSettings.config);

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
    expandable: true,
    expanded: true,
    transitions: {
      upClose: transitionFactory.webWidget.upHide(),
      downClose: transitionFactory.webWidget.downHide(),
      close: transitionFactory.webWidget.downHide(),
      downShow: transitionFactory.webWidget.downShow(),
      downHide: transitionFactory.webWidget.downHide(),
      upShow: transitionFactory.webWidget.upShow()
    },
    onShow,
    name: name,
    afterShowAnimate,
    onHide,
    onClose,
    onBack
  };

  const Embed = frameFactory(
    (params) => {
      return (
        <WebWidget
          ref='rootComponent'
          attachmentSender={submitTicketSettings.attachmentSender}
          channelChoice={helpCenterSettings.channelChoice}
          contextualSearchSender={helpCenterSettings.contextualSearchSender}
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
          style={containerStyle}
          subjectEnabled={settings.get('contactForm.subject')}
          tags={settings.get('contactForm.tags')}
          ticketFormSettings={settings.get('contactForm.ticketForms')}
          ticketFieldSettings={settings.get('contactForm.fields')}
          submitTicketAvailable={submitTicketAvailable}
          submitTicketConfig={submitTicketSettings.config}
          submitTicketSender={submitTicketSettings.submitTicketSender}
          updateFrameSize={params.updateFrameSize}
          viaId={settings.get('viaId')}
          zendeskHost={transport.getZendeskHost()} />
      );
    },
    frameParams,
    reduxStore
  );

  embed = {
    component: <Embed visible={false} />,
    submitTicketSettings,
    config: {
      helpCenterForm: helpCenterSettings.config,
      ticketSubmissionForm: submitTicketSettings.config
    }
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
    waitForRootComponent(() => {
      const rootComponent = getRootComponent();

      embed.instance.hide(options);

      if (rootComponent.state.showNotification) {
        rootComponent.clearNotification();
      }
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.setLastSearch', (params) => {
    waitForRootComponent(() => {
      getRootComponent().setState(_.pick(params, ['searchTerm', 'searchLocale']));
    });
  });

  mediator.channel.subscribe([
    'ticketSubmissionForm.update',
    'helpCenterForm.refreshLocale'
  ], () => {
    waitForRootComponent(() => {
      embed.instance.getChild().forceUpdate();
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.refreshLocale', () => {
    waitForRootComponent(() => {
      const {
        ticketForms,
        customFields,
        loadTicketForms,
        loadTicketFields } = embed.submitTicketSettings;

      if (!_.isEmpty(ticketForms)) {
        loadTicketForms(ticketForms, i18n.getLocale());
      } else if (customFields.ids || customFields.all) {
        loadTicketFields(customFields, i18n.getLocale());
      }

      embed.instance.getChild().forceUpdate();
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.prefill', (user) => {
    waitForRootComponent(() => {
      const submitTicketForm = getWebWidgetComponent().getSubmitTicketComponent();
      const formData = _.pickBy(_.pick(user, ['name', 'email']), _.isString);

      submitTicketForm.setState({
        formState: _.extend({}, submitTicketForm.state.formState, formData)
      });
    });
  });

  mediator.channel.subscribe('zopimChat.setUser', (user) => {
    waitForRootComponent(() => {
      const chat = getWebWidgetComponent().getChatComponent();

      chat.updateUser(_.pick(user, ['name', 'email']));
    });
  });

  mediator.channel.subscribe('helpCenterForm.setHelpCenterSuggestions', (options) => {
    hasManuallySetContextualSuggestions = true;
    performContextualHelp(options);
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

    performContextualHelp(options);
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
    const rootComponent = getRootComponent();
    const isAuthenticated = embed.config.helpCenterForm.signInRequired === false || hasAuthenticatedSuccessfully;

    if (isAuthenticated && rootComponent) {
      if (options.url) {
        options.pageKeywords = getPageKeywords();
      }

      rootComponent.contextualSearch(options);
      return true;
    }

    return false;
  };

  cappedIntervalCall(contextualSearchFn, 500, 10);
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
    hideZendeskLogo: false,
    formTitleKey: 'message',
    expandable: false,
    attachmentsEnabled: false,
    maxFileCount: 5,
    maxFileSize: 5 * 1024 * 1024, // 5 MB
    ticketForms: [],
    disableAutoComplete: false,
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
  const getTicketFormIds = (config) => {
    const settingTicketForms = settings.get('contactForm.ticketForms');
    const rawTicketForms = _.isEmpty(settingTicketForms)
                         ? config.ticketForms
                         : settingTicketForms;

    // TODO: Alter this code that accepts an array of objects or integers.
    //       This is to be done once pre-fill feature has been GA'd.
    //       We should expect an array of objects in the future.
    const firstElement = rawTicketForms[0];

    // Either return an array of Objects
    if (_.isObject(firstElement)) {
      return _.filter(rawTicketForms, (ticketForm) => {
        return _.isObjectLike(ticketForm) && ticketForm.id;
      });
    }

    // Or return an array of numbers
    return _.filter(rawTicketForms, _.isNumber);
  };
  const loadTicketForms = (ticketForms, locale) => {
    // TODO: Alter this code to return objects with id's once pre-fill is GA'd
    const ticketFormIds = _.map(ticketForms, (ticketForm) => ticketForm.id || ticketForm).join();
    const onDone = (res) => getWebWidgetComponent().getSubmitTicketComponent().updateTicketForms(res);
    const path = `/api/v2/ticket_forms/show_many.json?ids=${ticketFormIds}&include=ticket_fields`;

    getWithSpinner(path, locale, onDone);
  };
  const loadTicketFields = (customFields, locale) => {
    const onDone = (res) => getWebWidgetComponent().getSubmitTicketComponent().updateTicketFields(res);
    const pathIds = customFields.all ? '' : `field_ids=${customFields.ids.join()}&`;
    const path = `/embeddable/ticket_fields?${pathIds}locale=${locale}`;

    getWithSpinner(path, locale, onDone);
  };

  const { customFields } = config;
  const ticketForms = getTicketFormIds(config);

  if (!_.isEmpty(ticketForms)) {
    // TODO: Alter this code to return objects with id's once pre-fill is GA'd
    loadTicketForms(ticketForms, i18n.getLocale());
  } else if (customFields.ids || customFields.all === true) {
    loadTicketFields(customFields, i18n.getLocale());
    config.customFields = [];
  } else {
    setTimeout(() => {
      waitForRootComponent(() => {
        if (getRootComponent().updateContactForm) {
          getWebWidgetComponent().getSubmitTicketComponent().updateContactForm();
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
  const channelChoice = settings.get('channelChoice') && !settings.get('contactForm.suppress');
  const viewMoreEnabled = !!settings.get('helpCenter.viewMore');
  const helpCenterConfigDefaults = {
    position: 'right',
    contextualHelpEnabled: false,
    buttonLabelKey: 'message',
    formTitleKey: 'help',
    hideZendeskLogo: false,
    signInRequired: false,
    expandable: false,
    disableAutoComplete: false,
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
    channelChoice,
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

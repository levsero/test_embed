import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { WebWidget } from 'component/webWidget/WebWidget';
import { frameFactory } from 'embed/frameFactory';
import { authentication } from 'service/authentication';
import { beacon } from 'service/beacon';
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
         location } from 'utility/globals';
import { mouse } from 'utility/mouse';
import { isOnHelpCenterPage,
         isOnHostMappedDomain } from 'utility/pages';
import { cappedIntervalCall,
         getPageKeywords } from 'utility/utils';

import LoadingSpinnerStyles from 'component/loading/LoadingSpinner.sass';
import SubmitTicketStyles from 'component/submitTicket/SubmitTicket.sass';
import SubmitTicketFormStyles from 'component/submitTicket/SubmitTicketForm.sass';
import LauncherStyles from 'component/Launcher.sass';

const submitTicketCSS = `
  ${require('./webWidget.scss')}
  ${LoadingSpinnerStyles}
  ${SubmitTicketStyles}
  ${SubmitTicketFormStyles}
  ${LauncherStyles}
`;
let embed = null;
let backButtonSetByHelpCenter = false;
let hasManuallySetContextualSuggestions = false;
let hasAuthenticatedSuccessfully = false;
let useMouseDistanceContexualSearch = false;
let cancelTargetHandler = null;

function create(config) {
  let containerStyle;
  let frameStyle = {};

  const configDefaults = {
    position: 'right',
    hideZendeskLogo: false,
    expandable: false,
    color: '#659700'
  };
  const showBackButton = (show = true) => {
    get(name).instance.getChild().showBackButton(show);
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
    }
  }
  const submitTicketSettings = setUpSubmitTicket(config.ticketSubmissionForm);
  const helpCenterSettings = setUpHelpCenter(config.helpCenterForm);
  const globalConfig = _.extend(configDefaults, config.ticketSubmissionForm, config.helpCenterForm);
  const launcherSettings = setUpLauncher(config.launcher);

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
    css: submitTicketCSS + generateUserCSS(globalConfig.color),
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
    name: 'webWidget',
    afterShowAnimate() {
      const rootComponent = getRootComponent();

      if (rootComponent && isIE()) {
        if (rootComponent.refs.submitTicketForm) {
          rootComponent.refs.submitTicketForm.focusField();
        }
        if (rootComponent.focusField) {
          rootComponent.focusField();
        }
      }
    },
    onHide,
    onClose() {
      mediator.channel.broadcast(`${get().instance.getRootComponent().getActiveEmbed()}.onClose`);
    },
    onBack() {
      const name = get().instance.getRootComponent().getActiveEmbed();

      if (name === 'ticketSubmissionForm') {
        if (getRootComponent().state.selectedTicketForm) {
          showBackButton(backButtonSetByHelpCenter);
          getRootComponent().clearForm();
        } else {
          mediator.channel.broadcast('ticketSubmissionForm.onBackClick');
        }
      }
      else if (name === 'helpCenterForm') {
        const rootComponent = getRootComponent();

        if (rootComponent) {
          rootComponent.setState({
            articleViewActive: false
          });
          get(name).instance.getChild().showBackButton(false);
        }
      }
    },
    extend: {
      onClickHandler: (e) => {
        e.preventDefault();
        const name = get().instance.getRootComponent().getActiveEmbed();

        if (name === 'launcher') {
          beacon.trackUserAction('launcher', 'click', name);
          mediator.channel.broadcast('launcher.onClick');
        }
      }
    }
  };

  const Embed = frameFactory(
    (params) => {
      return (
        <WebWidget
          ref='rootComponent'
          submitTicketConfig={submitTicketSettings.config}
          onCancel={submitTicketSettings.onCancel}
          submitTicketSender={submitTicketSettings.submitTicketSender}
          attachmentSender={submitTicketSettings.attachmentSender}
          onSubmitted={submitTicketSettings.onSubmitted}
          position={globalConfig.position}
          style={containerStyle}
          showBackButton={showBackButton}
          subjectEnabled={settings.get('contactForm.subject')}
          hideZendeskLogo={globalConfig.hideZendeskLogo}
          onArticleClick={helpCenterSettings.onArticleClick}
          onSearch={helpCenterSettings.onSearch}
          helpCenterConfig={helpCenterSettings.config}
          showBackButton={showBackButton}
          searchSender={helpCenterSettings.searchSenderFn('/api/v2/help_center/search.json')}
          contextualSearchSender={helpCenterSettings.searchSenderFn('/api/v2/help_center/articles/embeddable_search.json')}
          imagesSender={helpCenterSettings.imagesSenderFn}
          fullscreen={isMobileBrowser()}
          originalArticleButton={settings.get('helpCenter.originalArticleButton')}
          localeFallbacks={settings.get('helpCenter.localeFallbacks')}
          channelChoice={helpCenterSettings.channelChoice}
          zendeskHost={transport.getZendeskHost()}
          onLauncherClick={params.onClickHandler}
          label={`embeddable_framework.launcher.label.${launcherSettings.config.labelKey}`}
          icon={launcherSettings.config.icon}
          updateFrameSize={params.updateFrameSize} />
      );
    },
    frameParams
  );

  embed = {
    component: <Embed visible={false} />,
    helpCenterConfig: helpCenterSettings.config,
    launcherConfig: launcherSettings.config
  };

  return this;
}

function setChatOnline(name, chatOnline) {
  waitForRootComponent(name, () => {
    getRootComponent(name).setChatOnline(chatOnline);
  });
}

function keywordsSearch(name, options) {
  const contextualSearchFn = () => {
    const rootComponent = getRootComponent(name);
    const isAuthenticated = get().helpCenterConfig.signInRequired === false || hasAuthenticatedSuccessfully;

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

function render(name) {
  if (embed && embed.instance) {
    throw new Error(`WebWidget has already been rendered.`);
  }

  const element = getDocumentHost().appendChild(document.createElement('div'));

  embed.instance = ReactDOM.render(embed.component, element);

  mediator.channel.subscribe('ticketSubmissionForm.show', function(options = {}) {
    waitForRootComponent(name, () => {
      get().instance.getRootComponent().setEmbed('ticketSubmissionForm');

      setTimeout(function() {
        get(name).instance.show(options);
      }, 0);
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.hide', function(options = {}) {
    waitForRootComponent(name, () => {
      const rootComponent = getRootComponent(name);

      embed.instance.hide(options);

      if (rootComponent.state.showNotification) {
        rootComponent.clearNotification();
      }
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.showBackButton', function() {
    waitForRootComponent(name, () => {
      if (isMobileBrowser() || !_.isEmpty(getRootComponent(name).state.ticketForms)) {
        get(name).instance.getChild().showBackButton();
        backButtonSetByHelpCenter = true;
      }
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.setLastSearch', function(params) {
    waitForRootComponent(name, () => {
      getRootComponent(name).setState(_.pick(params, ['searchTerm', 'searchLocale']));
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.refreshLocale', () => {
    waitForRootComponent(name, () => {
      getRootComponent(name).forceUpdate();
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.prefill', function(user) {
    prefillForm(name, user);
  });

  mediator.channel.subscribe('ticketSubmissionForm.update', function() {
    embed.instance.getChild().forceUpdate();
  });

  mediator.channel.subscribe('helpCenterForm.show', function(options = {}) {
    if (useMouseDistanceContexualSearch && options.viaApi) {
      useMouseDistanceContexualSearch = false;

      if (cancelTargetHandler) {
        cancelTargetHandler();
      }
    }

    // Stop stupid host page scrolling
    // when trying to focus HelpCenter's search field.
    setTimeout(function() {
      waitForRootComponent(name, () => {
        get(name).instance.show(options);
      });
    }, 0);
  });

  mediator.channel.subscribe('helpCenterForm.hide', function(options = {}) {
    waitForRootComponent(name, () => {
      get(name).instance.hide(options);
    });
  });

  mediator.channel.subscribe('helpCenterForm.setNextToChat', function() {
    waitForRootComponent(name, () => {
      getRootComponent(name).setChatOnline(true);
    });

    setChatOnline(name, true);
  });

  mediator.channel.subscribe('helpCenterForm.setNextToSubmitTicket', function() {
    waitForRootComponent(name, () => {
      getRootComponent(name).setChatOnline(false);
    });

    setChatOnline(name, false);
  });

  mediator.channel.subscribe('helpCenterForm.showNextButton', function(nextButton = true) {
    waitForRootComponent(name, () => {
      getRootComponent(name).showNextButton(nextButton);
    });
  });

  mediator.channel.subscribe('helpCenterForm.showBackButton', function() {
    get(name).instance.getChild().showBackButton();
  });

  mediator.channel.subscribe('helpCenterForm.setHelpCenterSuggestions', function(options) {
    hasManuallySetContextualSuggestions = true;
    performContextualHelp(name, options);
  });

  mediator.channel.subscribe('helpCenterForm.refreshLocale', () => {
    waitForRootComponent(name, () => {
      getRootComponent(name).forceUpdate();
    });
  });

  mediator.channel.subscribe('helpCenterForm.isAuthenticated', function() {
    hasAuthenticatedSuccessfully = true;
  });

  mediator.channel.subscribe('launcher.hide', (options = {}) => {
    waitForRootComponent(name, () => {
      get(name).instance.hide(options);
    });
  });

  mediator.channel.subscribe('launcher.show', (options = {}) => {
    waitForRootComponent(name, () => {
      get(name).instance.show(options);
    });
  });

  mediator.channel.subscribe('launcher.refreshLocale', () => {
    waitForRootComponent(name, () => {
      getRootComponent(name).forceUpdate();
    });
  });

  mediator.channel.subscribe('launcher.setLabelChat', () => {
    setIcon(name, 'Icon--chat');
    setLabel(name, 'embeddable_framework.launcher.label.chat');
    setHasUnreadMessages(name, false);
  });

  mediator.channel.subscribe('launcher.setLabelHelp', () => {
    const label = `embeddable_framework.launcher.label.${embed.launcherConfig.labelKey}`;

    setIcon(name, 'Icon');
    setLabel(name, label);
    setHasUnreadMessages(name, false);
  });

  mediator.channel.subscribe('launcher.setLabelChatHelp', () => {
    const label = `embeddable_framework.launcher.label.${embed.launcherConfig.labelKey}`;

    setIcon(name, 'Icon--chat');
    setLabel(name, label);
    setHasUnreadMessages(name, false);
  });

  mediator.channel.subscribe('launcher.setLabelUnreadMsgs', (unreadMsgs) => {
    const label = unreadMsgs > 1
                ? 'embeddable_framework.chat.notification_multiple'
                : 'embeddable_framework.chat.notification';
    const options = unreadMsgs > 1 ? { count: unreadMsgs } : {};

    setLabel(name, label, options);
    setHasUnreadMessages(name, true);
  });
}

function performContextualHelp(name, options) {
  const onHitFn = (name, options) => () => {
    keywordsSearch(name, options);
    useMouseDistanceContexualSearch = false;
  };

  if (!isMobileBrowser() && useMouseDistanceContexualSearch) {
    const launcherElement = document.getElementById('launcher');

    cancelTargetHandler = mouse.target(launcherElement, onHitFn(name, options));
  } else {
    helpCenter.keywordsSearch(name, options);
  }
}

function prefillForm(name, user) {
  waitForRootComponent(name, function() {
    const submitTicketForm = getRootComponent(name).refs.submitTicketForm;

    submitTicketForm.setState({
      formState: _.pick(user, ['name', 'email'])
    });
  });
}

function setLabel(name, label, options = {}) {
  waitForRootComponent(name, () => {
    getRootComponent(name).setLabel(label, options);
  });
}

function setIcon(name, icon) {
  waitForRootComponent(name, () => {
    getRootComponent(name).setIcon(icon);
  });
}

function setHasUnreadMessages(name, unread) {
  waitForRootComponent(name, () => {
    getRootComponent(name).setState({ hasUnreadMessages: unread });
  });
}

function get(name) {
  return embed;
}

function getRootComponent(name) {
  return get(name).instance.getRootComponent().refs.rootComponent;
}

function waitForRootComponent(name, callback) {
  if (get(name) && get(name).instance && getRootComponent(name)) {
    callback();
  } else {
    setTimeout(() => {
      waitForRootComponent(name, callback);
    }, 0);
  }
}

function list() {
  return { embed };
}

function postRender() {
  const config = get().helpCenterConfig;
  const authSetting = settings.get('authenticate');

  if (config.contextualHelpEnabled &&
      !hasManuallySetContextualSuggestions &&
      !isOnHelpCenterPage()) {
    const options = { url: true };

    performContextualHelp(name, options);
  }

  if (config.tokensRevokedAt) {
    authentication.revoke(config.tokensRevokedAt);
  }

  if (authSetting && authSetting.jwt) {
    authentication.authenticate(authSetting.jwt);
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
    color: '#659700'
  };
  const attachmentsSetting = settings.get('contactForm.attachments');

  config = _.extend(submitTicketConfigDefaults, config);

  if (attachmentsSetting === false) {
    config.attachmentsEnabled = false;
  }

  const ticketEndpointPath = '/api/v2/requests';
  const ticketAttachmentsEndpoint = '/api/v2/uploads';
  const submitTicketSender = (params, doneFn, failFn) => {
    const payload = {
      method: 'post',
      path: ticketEndpointPath,
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
      path: ticketAttachmentsEndpoint,
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
  const onCancel = function() {
    mediator.channel.broadcast('ticketSubmissionForm.onCancelClick');
  };
  const settingTicketForms = settings.get('contactForm.ticketForms');
  const ticketForms = _.isEmpty(settingTicketForms)
                    ? config.ticketForms
                    : settingTicketForms;

  if (!_.isEmpty(ticketForms)) {
    const ticketFormIds = ticketForms.join();

    waitForRootComponent(name, () => {
      getRootComponent(name).setLoading(true);
    });

    transport.get({
      method: 'get',
      path: `/api/v2/ticket_forms/show_many.json?ids=${ticketFormIds}&include=ticket_fields`,
      timeout: 20000,
      callbacks: {
        done(res) {
          // do this on next tick so that it never happens before
          // the one above that sets loading to true.
          setTimeout(() => {
            waitForRootComponent(name, () => {
              getRootComponent(name).updateTicketForms(JSON.parse(res.text));
            });
          }, 0);
        },
        fail() {
          // do this on next tick so that it never happens before
          // the one above that sets loading to true.
          setTimeout(() => {
            waitForRootComponent(name, () => {
              getRootComponent(name).setLoading(false);
            });
          }, 0);
        }
      }
    });
  }

  return {
    config,
    submitTicketSender,
    attachmentSender,
    onSubmitted,
    onCancel
  };
}

function setUpHelpCenter(config) {
  const channelChoice = settings.get('channelChoice') && !settings.get('contactForm.suppress');
  const helpCenterConfigDefaults = {
    position: 'right',
    contextualHelpEnabled: false,
    buttonLabelKey: 'message',
    formTitleKey: 'help',
    hideZendeskLogo: false,
    signInRequired: false,
    disableAutoSearch: false,
    expandable: false,
    enableMouseDrivenContextualHelp: false,
    viewMoreEnabled: false,
    color: '#659700'
  };

  const onArticleClick = function(trackPayload) {
    beacon.trackUserAction('helpCenter', 'click', 'helpCenterForm', trackPayload);
  };
  const onSearch = function(params) {
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

  config = _.extend(helpCenterConfigDefaults, config);

  const viewMoreSetting = settings.get('helpCenter.viewMore');

  if (viewMoreSetting !== null && config.viewMoreEnabled) {
    config.viewMoreEnabled = viewMoreSetting;
  }

  useMouseDistanceContexualSearch = config.enableMouseDrivenContextualHelp;

  return {
    config,
    onArticleClick,
    onSearch,
    searchSenderFn,
    imagesSenderFn,
    channelChoice
  };
}

function setUpLauncher(config) {
  const configDefaults = {
    onClick: () => {},
    position: 'right',
    icon: 'Icon',
    labelKey: 'help',
    visible: true,
    color: '#659700'
  };

  config = _.extend(configDefaults, config);

  return { config };
}

export const webWidget = {
  create: create,
  render: render,
  get: get,
  list: list
};

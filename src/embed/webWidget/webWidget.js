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

const webWidgetCSS = `
  ${require('./webWidget.scss')}
  ${LoadingSpinnerStyles}
  ${SubmitTicketStyles}
  ${SubmitTicketFormStyles}
`;
let embed = null;
let hasManuallySetContextualSuggestions = false;
let hasAuthenticatedSuccessfully = false;
let useMouseDistanceContexualSearch = false;
let cancelTargetHandler = null;

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
  mediator.channel.broadcast(`${getWebWidgetComponent().getActiveEmbed()}.onClose`);
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
  const helpCenterAvaliable = config.helpCenterForm;
  const submitTicketAvaliable = config.ticketSubmissionForm;
  const submitTicketSettings = setUpSubmitTicket(config.ticketSubmissionForm);
  const helpCenterSettings = setUpHelpCenter(config.helpCenterForm);
  const globalConfig = _.extend(configDefaults, helpCenterSettings.config);

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
          submitTicketConfig={submitTicketSettings.config}
          submitTicketSender={submitTicketSettings.submitTicketSender}
          attachmentSender={submitTicketSettings.attachmentSender}
          onSubmitted={submitTicketSettings.onSubmitted}
          position={globalConfig.position}
          style={containerStyle}
          helpCenterAvaliable={helpCenterAvaliable}
          submitTicketAvaliable={submitTicketAvaliable}
          showBackButton={showBackButton}
          subjectEnabled={settings.get('contactForm.subject')}
          hideZendeskLogo={globalConfig.hideZendeskLogo}
          onArticleClick={helpCenterSettings.onArticleClick}
          onSearch={helpCenterSettings.onSearch}
          onCancel={submitTicketSettings.onCancel}
          helpCenterConfig={helpCenterSettings.config}
          searchSender={helpCenterSettings.searchSenderFn('/api/v2/help_center/search.json')}
          contextualSearchSender={helpCenterSettings.searchSenderFn('/api/v2/help_center/articles/embeddable_search.json')} // eslint-disable-line
          imagesSender={helpCenterSettings.imagesSenderFn}
          fullscreen={isMobileBrowser()}
          originalArticleButton={settings.get('helpCenter.originalArticleButton')}
          localeFallbacks={settings.get('helpCenter.localeFallbacks')}
          channelChoice={helpCenterSettings.channelChoice}
          zendeskHost={transport.getZendeskHost()}
          updateFrameSize={params.updateFrameSize} />
      );
    },
    frameParams,
    reduxStore
  );

  embed = {
    component: <Embed visible={false} />,
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

  setUpMediator();
}

function setUpMediator() {
  mediator.channel.subscribe('ticketSubmissionForm.show', (options = {}) => {
    waitForRootComponent(() => {
      getWebWidgetComponent().setEmbed('ticketSubmissionForm');

      setTimeout(() => {
        embed.instance.show(options);
      }, 0);
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.hide', (options = {}) => {
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
    'ticketSubmissionForm.refreshLocale',
    'ticketSubmissionForm.update',
    'helpCenterForm.refreshLocale'
  ], () => {
    waitForRootComponent(() => {
      embed.instance.getChild().forceUpdate();
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.prefill', (user) => {
    waitForRootComponent(() => {
      const submitTicketForm = getRootComponent().refs.submitTicketForm;

      submitTicketForm.setState({
        formState: _.pick(user, ['name', 'email'])
      });
    });
  });

  mediator.channel.subscribe('helpCenterForm.show', (options = {}) => {
    if (useMouseDistanceContexualSearch && options.viaApi) {
      useMouseDistanceContexualSearch = false;

      if (cancelTargetHandler) {
        cancelTargetHandler();
      }
    }

    // Stop stupid host page scrolling
    // when trying to focus HelpCenter's search field.
    setTimeout(() => {
      waitForRootComponent(() => {
        embed.instance.show(options);
      });
    }, 0);
  });

  mediator.channel.subscribe('helpCenterForm.hide', (options = {}) => {
    waitForRootComponent(() => {
      embed.instance.hide(options);
    });
  });

  mediator.channel.subscribe('helpCenterForm.setHelpCenterSuggestions', (options) => {
    hasManuallySetContextualSuggestions = true;
    performContextualHelp(options);
  });

  mediator.channel.subscribe('helpCenterForm.isAuthenticated', () => {
    hasAuthenticatedSuccessfully = true;
  });
}

function get() {
  return embed;
}

function getRootComponent() {
  return getWebWidgetComponent().refs.rootComponent;
}

function getWebWidgetComponent() {
  return embed.instance.getRootComponent();
}

function waitForRootComponent(callback) {
  if (embed && embed.instance && getRootComponent()) {
    callback();
  } else {
    setTimeout(() => {
      waitForRootComponent(callback);
    }, 0);
  }
}

function postRender() {
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
  const settingTicketForms = settings.get('contactForm.ticketForms');
  const ticketForms = _.isEmpty(settingTicketForms)
                    ? config.ticketForms
                    : settingTicketForms;

  if (!_.isEmpty(ticketForms)) {
    const ticketFormIds = ticketForms.join();

    waitForRootComponent(() => {
      getRootComponent().setLoading(true);
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
            waitForRootComponent(() => {
              getRootComponent().updateTicketForms(JSON.parse(res.text));
            });
          }, 0);
        },
        fail() {
          // do this on next tick so that it never happens before
          // the one above that sets loading to true.
          setTimeout(() => {
            waitForRootComponent(() => {
              getRootComponent().setLoading(false);
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

  config = _.extend({}, helpCenterConfigDefaults, config);

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

export const webWidget = {
  create: create,
  render: render,
  get: get,
  postRender: postRender,
  keywordsSearch: keywordsSearch
};

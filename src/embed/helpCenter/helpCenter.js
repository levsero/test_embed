import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { HelpCenter } from 'component/helpCenter/HelpCenter';
import { frameFactory } from 'embed/frameFactory';
import { authentication } from 'service/authentication';
import { beacon } from 'service/beacon';
import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
import { transport } from 'service/transport';
import { transitionFactory } from 'service/transitionFactory';
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

const helpCenterCSS = require('./helpCenter.scss').toString();

let helpCenters = {};
let hasManuallySetContextualSuggestions = false;
let hasAuthenticatedSuccessfully = false;
let useMouseDistanceContexualSearch = false;
let cancelTargetHandler = null;

function create(name, config) {
  let containerStyle;
  let frameStyle = {};

  const channelChoice = settings.get('channelChoice') && !settings.get('contactForm.suppress');
  const configDefaults = {
    position: 'right',
    contextualHelpEnabled: false,
    buttonLabelKey: 'message',
    formTitleKey: 'help',
    hideZendeskLogo: false,
    golionLogo: false,
    signInRequired: false,
    disableAutoSearch: false,
    enableMouseDrivenContextualHelp: false,
    color: '#659700'
  };
  const onNextClick = function(embed) {
    mediator.channel.broadcast(name + '.onNextClick', embed);
  };
  const onArticleClick = function(trackPayload) {
    beacon.trackUserAction('helpCenter', 'click', name, trackPayload);
  };
  const showBackButton = function(show = true) {
    get(name).instance.getChild().setState({
      showBackButton: show
    });
  };
  const onSearch = function(params) {
    beacon.trackUserAction('helpCenter', 'search', name, params.searchTerm);
    mediator.channel.broadcast(name + '.onSearch', params);
  };

  const onShow = (frame) => {
    const rootComponent = frame.getRootComponent();

    if (rootComponent) {
      if (isMobileBrowser()) {
        setScaleLock(true);
        setTimeout(() => {
          mediator.channel.broadcast('.updateZoom', getZoomSizingRatio());
        }, 0);
      } else {
        rootComponent.focusField();
      }
    }
  };

  const onHide = (frame) => {
    const rootComponent = frame.getRootComponent();

    if (rootComponent) {
      if (isMobileBrowser()) {
        setScaleLock(false);
        rootComponent.resetState();
      }

      frame.getRootComponent().backtrackSearch();
    }
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

  config = _.extend(configDefaults, config);

  useMouseDistanceContexualSearch = config.enableMouseDrivenContextualHelp;

  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    const margin = settings.get('margin');

    frameStyle = _.extend({}, frameStyle, {
      width: 342,
      maxHeight: 500,
      marginLeft: margin,
      marginRight: margin
    });
    containerStyle = { width: 342 };
  }

  const Embed = frameFactory(
    (params) => {
      return (
        <HelpCenter
          ref='rootComponent'
          hideZendeskLogo={config.hideZendeskLogo}
          golionLogo={config.golionLogo}
          onNextClick={onNextClick}
          onArticleClick={onArticleClick}
          onSearch={onSearch}
          position={config.position}
          buttonLabelKey={config.buttonLabelKey}
          formTitleKey={config.formTitleKey}
          showBackButton={showBackButton}
          searchSender={searchSenderFn('/api/v2/help_center/search.json')}
          contextualSearchSender={searchSenderFn('/api/v2/help_center/articles/embeddable_search.json')}
          imagesSender={imagesSenderFn}
          style={containerStyle}
          fullscreen={isMobileBrowser()}
          updateFrameSize={params.updateFrameSize}
          disableAutoSearch={config.disableAutoSearch}
          originalArticleButton={settings.get('helpCenter.originalArticleButton')}
          localeFallbacks={settings.get('helpCenter.localeFallbacks')}
          channelChoice={channelChoice}
          zendeskHost={transport.getZendeskHost()} />
      );
    },
    {
      frameStyle: frameStyle,
      position: config.position,
      css: helpCenterCSS + generateUserCSS(config.color),
      name: name,
      fullscreenable: true,
      transitions: {
        upClose: transitionFactory.webWidget.upHide(),
        downClose: transitionFactory.webWidget.downHide(),
        upHide: transitionFactory.webWidget.upHide(),
        upShow: transitionFactory.webWidget.upShow(),
        downHide: transitionFactory.webWidget.downHide(),
        downShow: transitionFactory.webWidget.downShow()
      },
      afterShowAnimate(frame) {
        const rootComponent = frame.getRootComponent();

        if (rootComponent && isIE()) {
          rootComponent.focusField();
        }
      },
      onHide,
      onShow,
      onClose() {
        mediator.channel.broadcast(name + '.onClose');
      },
      onBack(frame) {
        const rootComponent = frame.getRootComponent();

        if (rootComponent) {
          rootComponent.setState({
            articleViewActive: false
          });
          frame.getChild().setState({
            showBackButton: false
          });
        }
      },
      extend: {}
    });

  helpCenters[name] = {
    component: <Embed visible={false} />,
    config: config
  };

  return this;
}

function list() {
  return helpCenters;
}

function get(name) {
  return helpCenters[name];
}

function getRootComponent(name) {
  return get(name).instance.getRootComponent();
}

function waitForRootComponent(name, callback) {
  if (getRootComponent(name)) {
    callback();
  } else {
    setTimeout(() => {
      waitForRootComponent(name, callback);
    }, 0);
  }
}

function updateHelpCenterButton(name, labelKey) {
  waitForRootComponent(name, () => {
    const label = i18n.t(`embeddable_framework.helpCenter.submitButton.label.${labelKey}`);

    getRootComponent(name).setState({ buttonLabel: label });
  });
}

function keywordsSearch(name, options) {
  const contextualSearchFn = () => {
    const rootComponent = getRootComponent(name);
    const isAuthenticated = get(name).config.signInRequired === false || hasAuthenticatedSuccessfully;

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
  if (helpCenters[name] && helpCenters[name].instance) {
    throw new Error(`HelpCenter ${name} has already been rendered.`);
  }

  const element = getDocumentHost().appendChild(document.createElement('div'));

  helpCenters[name].instance = ReactDOM.render(helpCenters[name].component, element);

  mediator.channel.subscribe(name + '.show', function(options = {}) {
    if (useMouseDistanceContexualSearch && options.viaActivate) {
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

  mediator.channel.subscribe(name + '.hide', function(options = {}) {
    waitForRootComponent(name, () => {
      get(name).instance.hide(options);
    });
  });

  mediator.channel.subscribe(name + '.setNextToChat', function() {
    waitForRootComponent(name, () => {
      getRootComponent(name).setChatOnline(true);
    });

    updateHelpCenterButton(name, 'chat');
  });

  mediator.channel.subscribe(name + '.setNextToSubmitTicket', function() {
    const buttonLabelKey = get(name).config.buttonLabelKey;

    waitForRootComponent(name, () => {
      getRootComponent(name).setChatOnline(false);
    });

    updateHelpCenterButton(name, `submitTicket.${buttonLabelKey}`);
  });

  mediator.channel.subscribe(name + '.showNextButton', function(nextButton = true) {
    waitForRootComponent(name, () => {
      getRootComponent(name).showNextButton(nextButton);
    });
  });

  mediator.channel.subscribe(name + '.showBackButton', function() {
    get(name).instance.getChild().setState({
      showBackButton: true
    });
  });

  mediator.channel.subscribe(name + '.setHelpCenterSuggestions', function(options) {
    hasManuallySetContextualSuggestions = true;
    performContextualHelp(name, options);
  });

  mediator.channel.subscribe(name + '.setLocale', (locale) => {
    waitForRootComponent(name, () => {
      getRootComponent(name).setState({ locale: locale });
    });
  });

  mediator.channel.subscribe(name + '.isAuthenticated', function() {
    hasAuthenticatedSuccessfully = true;
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

function postRender(name) {
  const config = get(name).config;
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

export const helpCenter = {
  create: create,
  list: list,
  get: get,
  keywordsSearch: keywordsSearch,
  render: render,
  postRender: postRender
};

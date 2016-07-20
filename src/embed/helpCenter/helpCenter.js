import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { HelpCenter } from 'component/HelpCenter';
import { frameFactory } from 'embed/frameFactory';
import { authentication } from 'service/authentication';
import { beacon } from 'service/beacon';
import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
import { transport } from 'service/transport';
import { transitionFactory } from 'service/transitionFactory';
import { isIE,
         isMobileBrowser } from 'utility/devices';
import { document,
         getDocumentHost } from 'utility/globals';
import { isOnHelpCenterPage } from 'utility/pages';
import { cappedIntervalCall,
         generateUserCSS,
         getPageKeywords,
         setScaleLock } from 'utility/utils';

const helpCenterCSS = require('./helpCenter.scss');
let helpCenters = {};
let hasManuallySetContextualSuggestions = false;
let hasAuthenticatedSuccessfully = false;
let hasInitialContextualSearchFired = false;

function create(name, config) {
  let containerStyle;

  const frameStyle = {};
  const configDefaults = {
    position: 'right',
    contextualHelpEnabled: false,
    buttonLabelKey: 'message',
    formTitleKey: 'help',
    hideZendeskLogo: false,
    signInRequired: false,
    disableAutoSearch: false,
    color: '#659700'
  };
  const onNextClick = function() {
    mediator.channel.broadcast(name + '.onNextClick');
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
      } else {
        rootComponent.focusField();
      }
      rootComponent.resetSearchFieldState();
    }
  };

  const onHide = (frame) => {
    const rootComponent = frame.getRootComponent();

    if (rootComponent) {
      if (isMobileBrowser()) {
        setScaleLock(false);
      }

      rootComponent.hideVirtualKeyboard();
      rootComponent.backtrackSearch();

      if (isMobileBrowser() && rootComponent.state.hasSearched === false) {
        rootComponent.setState({ showIntroScreen: true });
      }
    }
  };

  const senderPayload = (url) => (query, doneFn, failFn) => {
    const token = authentication.getToken();

    return {
      method: 'get',
      path: url,
      query: query,
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

  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    frameStyle.width = 342;
    frameStyle.maxHeight = 500;
    containerStyle = { width: 342, margin: settings.get('widgetMargin') };
  }

  const Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <HelpCenter
          ref='rootComponent'
          hideZendeskLogo={config.hideZendeskLogo}
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
          updateFrameSize={params.updateFrameSize}
          disableAutoSearch={config.disableAutoSearch}
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
        close: transitionFactory.webWidget.downHide(),
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
    }));

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

function keywordsSearch(name, options, mouseDistance) {
  const minMouseDistance = 200;
  const contextualSearchFn = () => {
    const rootComponent = getRootComponent(name);
    const isAuthenticated = get(name).config.signInRequired === false || hasAuthenticatedSuccessfully;

    if (isAuthenticated && rootComponent) {
      if (options.url) {
        options.pageKeywords = getPageKeywords();
      }

      rootComponent.contextualSearch(options);
      return true;
    } else {
      return false;
    }
  };

  if (hasManuallySetContextualSuggestions || hasInitialContextualSearchFired /* || isMobile */) {
    // If we have fired the initial page load URL contextual search request.
    // Then the subsequent calls must be via the API.
    cappedIntervalCall(contextualSearchFn, 500, 10);
  } else if (mouseDistance < minMouseDistance) {
    hasInitialContextualSearchFired = true;

    // Remove the `mousemove` event handler once the mouse reaches
    // the minimum distance from the widget. We only want this check
    // for the initial URL contextual search.
    document.onmousemove = null;
    cappedIntervalCall(contextualSearchFn, 500, 10);
  }
}

function render(name) {
  if (helpCenters[name] && helpCenters[name].instance) {
    throw new Error(`HelpCenter ${name} has already been rendered.`);
  }

  const element = getDocumentHost().appendChild(document.createElement('div'));

  helpCenters[name].instance = ReactDOM.render(helpCenters[name].component, element);

  mediator.channel.subscribe(name + '.show', function(options = {}) {
    // stop stupid host page scrolling
    // when trying to focus HelpCenter's search field
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
    updateHelpCenterButton(name, 'chat');
  });

  mediator.channel.subscribe(name + '.setNextToSubmitTicket', function() {
    const buttonLabelKey = get(name).config.buttonLabelKey;

    updateHelpCenterButton(name, `submitTicket.${buttonLabelKey}`);
  });

  mediator.channel.subscribe(name + '.showBackButton', function() {
    get(name).instance.getChild().setState({
      showBackButton: true
    });
  });

  mediator.channel.subscribe(name + '.setHelpCenterSuggestions', function(options) {
    hasManuallySetContextualSuggestions = true;
    keywordsSearch(name, options);
  });

  mediator.channel.subscribe(name + '.isAuthenticated', function() {
    hasAuthenticatedSuccessfully = true;
  });
}

function handleOnMouseMove(name, options, event) {
  const boundingRect = get(name).instance
                                .getDOMNode()
                                .getBoundingClientRect();
  const widgetCoords = { x: boundingRect.left, y: boundingRect.top };
  const mouseCoords = { x: event.clientX, y: event.clientY };

  if (__DEV__) {
    const line = document.getElementById('zeLine');

    line.setAttribute('x1', mouseCoords.x);
    line.setAttribute('x2', widgetCoords.x);
    line.setAttribute('y1', mouseCoords.y);
    line.setAttribute('y2', widgetCoords.y);
  }

  // Calculate the euclidean distance between the mouse and the widget.
  const lhs = Math.pow(widgetCoords.x - mouseCoords.x, 2);
  const rhs = Math.pow(widgetCoords.y - mouseCoords.y, 2);
  const distance = Math.sqrt(lhs + rhs);

  keywordsSearch(name, options, distance);
}

function postRender(name) {
  const config = get(name).config;
  const authSetting = settings.get('authenticate');

  if (config.contextualHelpEnabled &&
      !hasManuallySetContextualSuggestions &&
      !isOnHelpCenterPage()) {
    const options = { search: getPageKeywords() };

    // Listen to the `mousemove` event so we can grab the x and y coordinate
    // of the end-users mouse relative to the host page viewport.
    document.onmousemove = (e) => handleOnMouseMove(name, options, e);
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
  render: render,
  postRender: postRender
};

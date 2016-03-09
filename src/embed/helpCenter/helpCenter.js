import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { HelpCenter } from 'component/HelpCenter';
import { frameFactory } from 'embed/frameFactory';
import { getToken } from 'service/authorization';
import { beacon } from 'service/beacon';
import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { transport } from 'service/transport';
import { transitionFactory } from 'service/transitionFactory';
import { isIE,
         isMobileBrowser } from 'utility/devices';
import { document,
         getDocumentHost,
         location } from 'utility/globals';
import { generateUserCSS,
         getPageKeywords,
         setScaleLock } from 'utility/utils';

const helpCenterCSS = require('./helpCenter.scss');
let helpCenters = {};

function create(name, config) {
  let containerStyle, posObj;

  const frameStyle = {
    position: 'fixed',
    bottom: 0
  };
  const configDefaults = {
    position: 'right',
    contextualHelpEnabled: false,
    buttonLabelKey: 'message',
    formTitleKey: 'help',
    hideZendeskLogo: false
  };
  const onNextClick = function() {
    mediator.channel.broadcast(name + '.onNextClick');
  };
  const showBackButton = function() {
    get(name).instance.getChild().setState({
      showBackButton: true
    });
  };
  const onSearch = function(params) {
    beacon.track('helpCenter', 'search', name, params.searchTerm);
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

  const searchSender = (query, doneFn, failFn) => {
    const payload = {
      method: 'get',
      path: '/api/v2/help_center/search.json',
      query: query,
      authorization: `Bearer ${getToken()}`,
      callbacks: {
        done: doneFn,
        fail: failFn
      }
    };

    transport.send(payload);
  };

  config = _.extend(configDefaults, config);

  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    posObj = (config.position === 'left')
           ? { left:  0 }
           : { right: 0 };

    frameStyle.width = 342;
    frameStyle.maxHeight = 500;
    containerStyle = { width: 342, margin: 15 };
  }

  const Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <HelpCenter
          ref='rootComponent'
          hideZendeskLogo={config.hideZendeskLogo}
          onNextClick={onNextClick}
          onSearch={onSearch}
          position={config.position}
          buttonLabelKey={config.buttonLabelKey}
          formTitleKey={config.formTitleKey}
          showBackButton={showBackButton}
          searchSender={searchSender}
          style={containerStyle}
          updateFrameSize={params.updateFrameSize}
          zendeskHost={transport.getZendeskHost()} />
      );
    },
    {
      frameStyle: _.extend(frameStyle, posObj),
      css: helpCenterCSS + generateUserCSS({color: config.color}),
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

function updateHelpCenterButton(name, labelKey) {
  const rootComponent = getRootComponent(name);
  const label = i18n.t(`embeddable_framework.helpCenter.submitButton.label.${labelKey}`);

  if (rootComponent) {
    rootComponent.setState({ buttonLabel: label });
  }
}

function keywordsSearch(name, options) {
  const rootComponent = getRootComponent(name);

  if (rootComponent) {
    rootComponent.contextualSearch(options);
  } else {
    setTimeout(() => {
      keywordsSearch(name, options);
    }, 0);
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
      if (getRootComponent(name)) {
        get(name).instance.show(options);
      }
    }, 0);
  });

  mediator.channel.subscribe(name + '.hide', function(options = {}) {
    if (getRootComponent(name)) {
      get(name).instance.hide(options);
    }
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
    keywordsSearch(name, options);
  });
}

function postRender(name) {
  const config = get(name).config;

  if (config.contextualHelpEnabled
      && location.pathname && location.pathname.substring(0, 4) !== '/hc/') {
    keywordsSearch(name, { search: getPageKeywords() });
  }
}

export const helpCenter = {
  create: create,
  list: list,
  get: get,
  render: render,
  postRender: postRender
};

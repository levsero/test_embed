import React from 'react/addons';
import _     from 'lodash';

import { document,
         getDocumentHost } from 'utility/globals';
import { HelpCenter }      from 'component/HelpCenter';
import { frameFactory }    from 'embed/frameFactory';
import { setScaleLock }    from 'utility/utils';
import { isMobileBrowser,
         isIE }            from 'utility/devices';
import { beacon }          from 'service/beacon';
import { i18n }            from 'service/i18n';
import { transport }       from 'service/transport';
import { mediator }        from 'service/mediator';
import { generateUserCSS } from 'utility/utils';

const helpCenterCSS = require('./helpCenter.scss');
let helpCenters = {};

function create(name, config) {
  let containerStyle,
      posObj;

  const frameStyle = {
    position: 'fixed',
    bottom: 0
  };
  const configDefaults = {
    position: 'right',
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
    beacon.track('helpCenter', 'search', name, params.searchString);
    mediator.channel.broadcast(name + '.onSearch', params);
  };

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
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
          showBackButton={showBackButton}
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
      afterShowAnimate(frame) {
        if (isIE()) {
          frame.getRootComponent().focusField();
        }
      },
      onHide(frame) {
        if (isMobileBrowser()) {
          setScaleLock(false);
        }
        frame.getRootComponent().hideVirtualKeyboard();
        frame.getRootComponent().backtrackSearch();

        if (frame.getRootComponent().state.hasSearched === false &&
            isMobileBrowser()) {
          frame.getRootComponent().setState({
            showIntroScreen: true
          });
        }
      },
      onShow(frame) {
        if (isMobileBrowser()) {
          setScaleLock(true);
        }
        if (!isMobileBrowser()) {
          frame.getRootComponent().focusField();
        }
        frame.getRootComponent().resetSearchFieldState();
      },
      onClose() {
        mediator.channel.broadcast(name + '.onClose');
      },
      onBack(frame) {
        frame.getRootComponent().setState({
          articleViewActive: false
        });
        frame.getChild().setState({
          showBackButton: false
        });
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
  const helpCenter = getRootComponent(name);
  const label = i18n.t(`embeddable_framework.helpCenter.submitButton.label.${labelKey}`);

  helpCenter.setState({
    buttonLabel: label
  });
}

function keywordsSearch(name, keywords) {
  if (getRootComponent(name)) {
    const helpCenter = getRootComponent(name);
    helpCenter.contextualHelp(keywords);
  } else {
    setTimeout(() => {
      keywordsSearch(name, keywords);
    }, 0);
  }

}

function render(name) {
  if (helpCenters[name] && helpCenters[name].instance) {
    throw new Error(`HelpCenter ${name} has already been rendered.`);
  }

  const element = getDocumentHost().appendChild(document.createElement('div'));

  helpCenters[name].instance = React.render(helpCenters[name].component, element);

  mediator.channel.subscribe(name + '.show', function() {
    // stop stupid host page scrolling
    // when trying to focus HelpCenter's search field
    setTimeout(function() {
      get(name).instance.show();
    }, 0);
  });

  mediator.channel.subscribe(name + '.showWithAnimation', function() {
    // stop stupid host page scrolling
    // when trying to focus HelpCenter's search field
    setTimeout(function() {
      get(name).instance.show(true);
    }, 0);
  });

  mediator.channel.subscribe(name + '.hide', function() {
    get(name).instance.hide();
  });

  mediator.channel.subscribe(name + '.setNextToChat', function() {
    updateHelpCenterButton(name, 'chat');
  });

  mediator.channel.subscribe(name + '.setNextToSubmitTicket', function() {
    updateHelpCenterButton(name, 'submitTicket');
  });

  mediator.channel.subscribe(name + '.showBackButton', function() {
    get(name).instance.getChild().setState({
      showBackButton: true
    });
  });

  mediator.channel.subscribe(name + '.setKeywords', function(keywords) {
    keywordsSearch(name, keywords);
  });

}

export var helpCenter = {
  create: create,
  list: list,
  get: get,
  render: render
};

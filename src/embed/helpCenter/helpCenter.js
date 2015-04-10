/** @jsx React.DOM */

module React from 'react/addons';

import { document,
         getDocumentHost } from 'utility/globals';
import { HelpCenter }      from 'component/HelpCenter';
import { frameFactory }    from 'embed/frameFactory';
import { setScaleLock }    from 'utility/utils';
import { isMobileBrowser,
         isIe }          from 'utility/devices';
import { beacon }          from 'service/beacon';
import { i18n }            from 'service/i18n';
import { transport }       from 'service/transport';
import { mediator }        from 'service/mediator';
import { generateUserCSS } from 'utility/utils';

require('imports?_=lodash!lodash');

var helpCenterCSS = require('./helpCenter.scss'),
    helpCenters = {};

function create(name, config) {
  var containerStyle,
      iframeBase = {
        position: 'fixed',
        bottom: 50
      },
      configDefaults = {
        position: 'right',
        hideZendeskLogo: false
      },
      posObj,
      iframeStyle,
      onButtonClick = function() {
        mediator.channel.broadcast(name + '.onNextClick');
      },
      showBackButton = function() {
        get(name).instance.getChild().setState({
          showBackButton: true
        });
      },
      onLinkClick = function(ev) {
        beacon.track('helpCenter', 'click', name, ev.target.href);
      },
      onSearch = function(searchString) {
        beacon.track('helpCenter', 'search', name, searchString);
      },
      Embed;

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    posObj = (config.position === 'left')
           ? { left:  5 }
           : { right: 5 };

    iframeBase.minWidth = 400;
    iframeBase.maxHeight = 500;
    containerStyle = { minWidth: 400, margin: 15 };
  }

  iframeStyle = _.extend(iframeBase, posObj);

  Embed = React.createClass(frameFactory(
    (params) => {
      return (
        /* jshint quotmark: false */
        <div style={containerStyle}>
          <HelpCenter
            ref='helpCenter'
            zendeskHost={transport.getZendeskHost()}
            onButtonClick={onButtonClick}
            showBackButton={showBackButton}
            onLinkClick={onLinkClick}
            onSearch={onSearch}
            hideZendeskLogo={config.hideZendeskLogo}
            position={config.position}
            updateFrameSize={params.updateFrameSize} />
        </div>
      );
    },
    {
      style: iframeStyle,
      css: helpCenterCSS + generateUserCSS({color: config.color}),
      name: name,
      fullscreenable: true,
      afterShowAnimate(child) {
        child.refs.helpCenter.focusField();
      },
      onHide(child) {
        if (isMobileBrowser()) {
          setScaleLock(false);
        }
        child.refs.helpCenter.hideVirtualKeyboard();
      },
      onShow(child) {
        if (isMobileBrowser()) {
          setScaleLock(true);
        }
        if (!isIe()) {
          child.refs.helpCenter.focusField();
        }
        child.refs.helpCenter.resetSearchFieldState();
      },
      onClose() {
        mediator.channel.broadcast(name + '.onClose');
      },
      onBack(child) {
        child.refs.helpCenter.setState({
          articleViewActive: false
        });
        child.setState({
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

function updateHelpCenterButton(name, labelKey) {
  /* jshint unused:false */
  var helpCenter = get(name).instance.getChild().refs.helpCenter,
      label = i18n.t(`embeddable_framework.helpCenter.submitButton.label.${labelKey}`);

  helpCenter.setState({
    buttonLabel: label
  });
}

function render(name) {
  if (helpCenters[name] && helpCenters[name].instance) {
    throw new Error(`HelpCenter ${name} has already been rendered.`);
  }

  var element = getDocumentHost().appendChild(document.createElement('div'));

  helpCenters[name].instance = React.renderComponent(helpCenters[name].component, element);

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

}

export var helpCenter = {
  create: create,
  list: list,
  get: get,
  render: render
};

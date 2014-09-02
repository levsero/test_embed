/** @jsx React.DOM */


module React from 'react/addons';

import { document }        from 'utility/globals';
import { frameFactory }    from 'embed/frameFactory';
import { HelpCenter }      from 'component/HelpCenter';
import { isMobileBrowser } from 'utility/devices';

require('imports?_=lodash!lodash');

var helpCenterCSS = require('./helpCenter.scss'),
    helpCenters = {};

function create(name, config) {
  var containerStyle,
      iframeBase = {
        position: 'fixed',
        bottom: 48
      },
      iframeBase = {
        position: 'fixed',
        bottom: 80
      },
      configDefaults = {
        position: 'right'
      },
      posObj,
      iframeStyle,
      Embed,
      onSubmit = function() {
        var helpCenter = get(name);

        if(helpCenter.chatStatus) {
          config.updateChat(false, true);
          helpCenter.embedShown = 'chat';
        } else {
          config.transitionSubmitTicket();
          helpCenter.embedShown = 'submitTicket';
        }
        transition(name);
      };

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    posObj = (config.position === 'left')
           ? { left:  5 }
           : { right: 5 };

    iframeBase.minWidth = 350;
    containerStyle = { minWidth: 350, margin: 15 };
  }

  iframeStyle = _.extend(iframeBase, posObj);


  Embed = React.createClass(frameFactory(
    (params) => {
      return (
        /* jshint quotmark: false */
        <div style={containerStyle}>
          <HelpCenter
            ref='helpCenter'
            zendeskHost={document.zendeskHost}
            onSubmit={onSubmit}
            updateFrameSize={params.updateFrameSize} />
        </div>
      );
    },
    {
      style: iframeStyle,
      css: helpCenterCSS,
      onHide() {
        config.onHide();
      },
      onShow() {
        config.onShow();
      },
      onClose() {
        update(name, true);
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

function show(name) {
  get(name).instance.show();
}

function hide(name) {
  get(name).instance.hide();
}

function transition(name) {
  get(name).instance.transition();
}

function transitionBack(name) {
  transition(name);
  get(name).embedShown = 'helpCenter';
}

function update(name, isVisible) {
  var helpCenter = get(name),
      config = helpCenter.config;

  if (isVisible) {
    switch (helpCenter.embedShown) {
      case 'chat':
        config.updateChat(true);
        break;
      case 'submitTicket':
        config.updateSubmitTicket(true);
        break;
      default:
        hide(name);
    }
  } else {
    switch (helpCenter.embedShown) {
      case 'chat':
        config.updateChat(false);
        break;
      case 'submitTicket':
        config.updateSubmitTicket(false);
        break;
      default:
        show(name);
    }
  }
}

function setChatStatus(name, status) {
  get(name).chatStatus = status;
}

function isChatting(name) {
  get(name).embedShown = 'chat';
  hide(name);
  get(name).config.onShow();
}

function render(name) {
  if (helpCenters[name] && helpCenters[name].instance) {
    throw new Error(`HelpCenter ${name} has already been rendered.`);
  }

  var element = document.body.appendChild(document.createElement('div'));
  helpCenters[name].instance = React.renderComponent(helpCenters[name].component, element);
}

export var helpCenter = {
  create: create,
  list: list,
  get: get,
  show: show,
  hide: hide,
  render: render,
  update: update,
  isChatting: isChatting,
  setChatStatus: setChatStatus
};

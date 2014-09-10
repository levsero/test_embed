/** @jsx React.DOM */

module React from 'react/addons';

import { document }        from 'utility/globals';
import { frameFactory }    from 'embed/frameFactory';
import { HelpCenter }      from 'component/HelpCenter';
import { isMobileBrowser } from 'utility/devices';
import { beacon }          from 'service/beacon';
import { i18n }            from 'service/i18n';

require('imports?_=lodash!lodash');

var helpCenterCSS = require('./helpCenter.scss'),
    helpCenters = {};

function create(name, config) {
  var containerStyle,
      iframeBase = {
        position: 'fixed',
        bottom: 48
      },
      configDefaults = {
        position: 'right'
      },
      posObj,
      iframeStyle,
      onButtonClick = function(search) {
        var helpCenter = get(name);

        if (helpCenter.chatStatus) {
          config.updateChat(false, true);
          helpCenter.activeEmbed = 'chat';
        } else {
          config.toggleSubmitTicket();
          helpCenter.activeEmbed = 'submitTicket';
        }
        toggleVisibility(name);
        beacon.track('helpCenter', 'search', search);
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
            onButtonClick={onButtonClick}
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

function toggleVisibility(name) {
  get(name).instance.toggleVisibility();
}

function transitionBack(name) {
  toggleVisibility(name);
  get(name).activeEmbed = 'helpCenter';
}

function update(name, isVisible) {
  var helpCenter = get(name),
      config = helpCenter.config;

  if (helpCenter.activeEmbed === 'chat') {
    config.updateChat(isVisible);
  } else if (helpCenter.activeEmbed === 'submitTicket') {
    config.updateSubmitTicket(isVisible);
  } else {
    if(isVisible) {
      hide(name);
    } else {
      show(name);
    }
  }
}

function setChatStatus(name, status) {
  get(name).chatStatus = status;
  updateHelpCenterButton(name, status);
}

function updateHelpCenterButton(name, status) {
  var helpCenter = get(name).instance.getChild().refs.helpCenter,
      helpCenterForm = helpCenter.refs.helpCenterForm,
      label = (status) ? i18n.t('embeddable_framework.helpCenter.submitButton.label.chat')
                       : i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket');

  helpCenterForm.setState({
    buttonLabel: label
  });
}

function isChatting(name) {
  get(name).activeEmbed = 'chat';
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
  setChatStatus: setChatStatus,
  transitionBack: transitionBack
};

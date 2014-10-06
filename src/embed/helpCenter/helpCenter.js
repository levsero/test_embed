/** @jsx React.DOM */

module React from 'react/addons';

import { document as doc } from 'utility/globals';
import { HelpCenter }      from 'component/HelpCenter';
import { frameFactory }    from 'embed/frameFactory';
import { setScaleLock }    from 'utility/utils';
import { isMobileBrowser } from 'utility/devices';
import { beacon }          from 'service/beacon';
import { i18n }            from 'service/i18n';
import { transport }       from 'service/transport';

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
        position: 'right'
      },
      posObj,
      iframeStyle,
      onButtonClick = function() {
        var helpCenter = get(name);

        if (helpCenter.chatStatus) {
          config.updateChat(false, true);
          helpCenter.activeEmbed = 'chat';
        } else {
          config.toggleSubmitTicket();
          helpCenter.activeEmbed = 'submitTicket';
        }
        toggleVisibility(name);
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
            onLinkClick={onLinkClick}
            onSearch={onSearch}
            updateFrameSize={params.updateFrameSize} />
        </div>
      );
    },
    {
      style: iframeStyle,
      css: helpCenterCSS,
      fullscreenable: true,
      onHide() {
        setScaleLock(false);
        config.onHide();
      },
      onShow() {
        setScaleLock(true);
        config.onShow();
        get(name).instance.getChild().refs.helpCenter.focusField();
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
  var helpCenter = get(name);

  helpCenter.visible = true;
  helpCenter.instance.show();
  helpCenter.activeEmbed = 'helpCenter';
}

function hide(name) {
  var helpCenter = get(name);

  helpCenter.instance.hide();
  helpCenter.visible = false;
}

function toggleVisibility(name) {
  get(name).instance.toggleVisibility();
}

function transitionBack(name, showEmbed = true) {
  if (showEmbed) {
    toggleVisibility(name);
  }
  get(name).activeEmbed = 'helpCenter';
}

function update(name, isVisible) {
  var helpCenter = get(name),
      config = helpCenter.config;

  if (helpCenter.activeEmbed === 'chat') {
    config.updateChat(isVisible);
    config.setLabel(i18n.t('embeddable_framework.launcher.label.help'));
  } else if (helpCenter.activeEmbed === 'submitTicket') {
    config.updateSubmitTicket(isVisible);
  } else {
    if (isVisible) {
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
  /* jshint unused:false */
  var helpCenter = get(name).instance.getChild().refs.helpCenter,
      labelKey = status ? 'chat' : 'submitTicket',
      label = i18n.t(`embeddable_framework.helpCenter.submitButton.label.${labelKey}`);

  helpCenter.setState({
    buttonLabel: label
  });
}

function isChatting(name) {
  var helpCenter = get(name);

  helpCenter.activeEmbed = 'chat';

  if (helpCenter.visible) {
    hide(name);
  } else {
    hide(name);
    helpCenter.config.onShow();
  }
}

function render(name) {
  if (helpCenters[name] && helpCenters[name].instance) {
    throw new Error(`HelpCenter ${name} has already been rendered.`);
  }

  var element = doc.body.appendChild(doc.createElement('div'));
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

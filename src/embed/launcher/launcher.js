/** @jsx React.DOM */
module React from 'react/addons';

import { document }        from 'utility/globals';
import { Launcher }        from 'component/Launcher';
import { beacon }          from 'service/beacon';
import { frameFactory }    from 'embed/frameFactory';
import { isMobileBrowser } from 'utility/devices';
import { i18n }            from 'service/i18n';
import { mediator }        from 'service/mediator';
import { generateUserCSS } from 'utility/utils';

require('imports?_=lodash!lodash');

var launcherCSS = require('./launcher.scss'),
    launchers = {};

function create(name, config) {
  var configDefaults = {
        onClick: function() {},
        position: 'right',
        label: i18n.t('embeddable_framework.launcher.label.help'),
        icon: 'Icon',
        visible: true
      },
      base = {
        width: '80px',
        height: '50px',
        position: 'fixed',
        bottom: '10px'
      },
      posObj,
      iframeStyle,
      Embed;

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  posObj = (config.position === 'left')
         ? { 'left':  '20px' }
         : { 'right': '20px' };

  iframeStyle = _.extend(base, posObj);

  Embed = React.createClass(frameFactory(
    (params) => {
      return (
        /* jshint quotmark:false */
        <Launcher
          ref='launcher'
          onClick={params.onClickHandler}
          onTouchEnd={params.onClickHandler}
          updateFrameSize={params.updateFrameSize}
          position={config.position}
          label={config.label}
          icon={config.icon}
        />
      );
    },
    {
      style: iframeStyle,
      css: launcherCSS + generateUserCSS({color: config.color}),
      name: name,
      fullscreenable: false,
      extend: {
        onClickHandler: function(e) {
          e.preventDefault();
          beacon.track('launcher', 'click', name);
          mediator.channel.broadcast(name + '.onClick');
        }
      }
    }));

  launchers[name] = {
    component: <Embed visible={config.visible} />,
    config: config
  };
}

function list() {
  return launchers;
}

function get(name) {
  return launchers[name];
}

function getChildRefs(name) {
  return get(name).instance.getChild().refs;
}

function setIcon(name, icon) {
  getChildRefs(name).launcher.setIcon(icon);
}

function render(name) {
  if (launchers[name] && launchers[name].instance) {
    throw new Error(`Launcher ${name} has already been rendered.`);
  }

  var element = document.body.appendChild(document.createElement('div'));
  launchers[name].instance = React.renderComponent(launchers[name].component, element);

  mediator.channel.subscribe(name + '.activate', function() {
    getChildRefs(name).launcher.setActive(true);
  });

  mediator.channel.subscribe(name + '.deactivate', function() {
    getChildRefs(name).launcher.setActive(false);
  });

  mediator.channel.subscribe(name + '.hide', function() {
    get(name).instance.hide();
  });

  mediator.channel.subscribe(name + '.show', function() {
    get(name).instance.show();
  });

  mediator.channel.subscribe(name + '.setLabelChat', function() {
    setIcon(name, 'Icon--chat');
    setLabel(name, i18n.t('embeddable_framework.launcher.label.chat'));
  });

  mediator.channel.subscribe(name + '.setLabelHelp', function() {
    setIcon(name, 'Icon');
    setLabel(name, i18n.t('embeddable_framework.launcher.label.help'));
  });

  mediator.channel.subscribe(name + '.setLabelChatHelp', function() {
    setIcon(name, 'Icon--chat');
    setLabel(name, i18n.t('embeddable_framework.launcher.label.help'));
  });

  mediator.channel.subscribe(name + '.setLabelUnreadMsgs', function(unreadMsgs) {
    var label = i18n.t(
      'embeddable_framework.chat.notification',
      {count: unreadMsgs}
    );
    setLabel(name, label);
  });

}

function setLabel(name, label) {
  getChildRefs(name).launcher.setLabel(label);
}

export var launcher = {
  create: create,
  list: list,
  get: get,
  render: render,
  setIcon: setIcon,
  setLabel: setLabel
};


import React from 'react/addons';
import _     from 'lodash';

import { document,
         getDocumentHost } from 'utility/globals';
import { Launcher }        from 'component/Launcher';
import { beacon }          from 'service/beacon';
import { frameFactory }    from 'embed/frameFactory';
import { i18n }            from 'service/i18n';
import { mediator }        from 'service/mediator';
import { generateUserCSS } from 'utility/utils';

const launcherCSS = require('./launcher.scss');
let launchers = {};

function create(name, config) {
  const configDefaults = {
    onClick: function() {},
    position: 'right',
    icon: 'Icon',
    defaultLabel: 'help',
    visible: true
  };
  const frameStyle = {
    width: '80px',
    height: '50px',
    position: 'fixed',
    bottom: '10px'
  };

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  let posObj = (config.position === 'left')
             ? { 'left':  '20px' }
             : { 'right': '20px' };

  const Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <Launcher
          ref='rootComponent'
          onClick={params.onClickHandler}
          onTouchEnd={params.onClickHandler}
          updateFrameSize={params.updateFrameSize}
          position={config.position}
          label={i18n.t(`embeddable_framework.launcher.label.${config.defaultLabel}`)}
          icon={config.icon} />
      );
    },
    {
      frameStyle: _.extend(frameStyle, posObj),
      css: launcherCSS + generateUserCSS({color: config.color}),
      name: name,
      hideCloseButton: true,
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
    component: <Embed visible={config.visible} position={config.position} />,
    config: config
  };
}

function list() {
  return launchers;
}

function get(name) {
  return launchers[name];
}

function getRootComponent(name) {
  return get(name).instance.getRootComponent();
}

function setIcon(name, icon) {
  if (getRootComponent(name)) {
    getRootComponent(name).setIcon(icon);
  } else {
    setTimeout(() => {
      setIcon(name, icon);
    }, 0);
  }
}

function setHasUnreadMessages(name, unread) {
  if (getRootComponent(name)) {
    getRootComponent(name).setState({ hasUnreadMessages: unread });
  } else {
    setTimeout(() => {
      setHasUnreadMessages(name, unread);
    }, 0);
  }
}

function render(name) {
  if (launchers[name] && launchers[name].instance) {
    throw new Error(`Launcher ${name} has already been rendered.`);
  }

  const element = getDocumentHost().appendChild(document.createElement('div'));

  launchers[name].instance = React.render(launchers[name].component, element);

  mediator.channel.subscribe(name + '.hide', function() {
    get(name).instance.hide();
  });

  mediator.channel.subscribe(name + '.show', function() {
    get(name).instance.show();
  });

  mediator.channel.subscribe(name + '.setLabelChat', function() {
    setIcon(name, 'Icon--chat');
    setLabel(name, i18n.t('embeddable_framework.launcher.label.chat'));
    setHasUnreadMessages(name, false);
  });

  mediator.channel.subscribe(name + '.setLabelHelp', function() {
    setIcon(name, 'Icon');
    setLabel(
      name,
      i18n.t(`embeddable_framework.launcher.label.${launchers[name].config.defaultLabel}`)
    );
    setHasUnreadMessages(name, false);
  });

  mediator.channel.subscribe(name + '.setLabelChatHelp', function() {
    setIcon(name, 'Icon--chat');
    setLabel(
      name,
      i18n.t(`embeddable_framework.launcher.label.${launchers[name].config.defaultLabel}`)
    );
    setHasUnreadMessages(name, false);
  });

  mediator.channel.subscribe(name + '.setLabelUnreadMsgs', function(unreadMsgs) {
    const label = i18n.t(
      'embeddable_framework.chat.notification',
      {count: unreadMsgs}
    );
    setLabel(name, label);
    setHasUnreadMessages(name, true);
  });

}

function setLabel(name, label) {
  if (getRootComponent(name)) {
    getRootComponent(name).setLabel(label);
  } else {
    setTimeout(() => {
      setLabel(name, label);
    }, 0);
  }
}

export var launcher = {
  create: create,
  list: list,
  get: get,
  render: render,
  setIcon: setIcon,
  setLabel: setLabel
};

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { launcherStyles } from './launcherStyles.js';
import { document,
         getDocumentHost } from 'utility/globals';
import { Frame } from 'component/frame/Frame';
import Launcher from 'component/Launcher';
import { beacon } from 'service/beacon';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
import { generateUserCSS } from 'utility/color';
import { transitionFactory } from 'service/transitionFactory';

const launcherCSS = `${require('./launcher.scss')} ${launcherStyles}`;

let launchers = {};

function create(name, config, reduxStore) {
  const configDefaults = {
    onClick: () => {},
    position: 'right',
    icon: 'Icon',
    labelKey: 'help',
    visible: true,
    color: '#659700'
  };
  const frameStyle = {
    width: '80px',
    height: '50px',
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: '20px',
    marginRight: '20px',
    zIndex: settings.get('zIndex') - 1
  };

  config = _.extend(configDefaults, config);

  const onClick = (e) => {
    e.preventDefault();

    beacon.trackUserAction('launcher', 'click', name);
    mediator.channel.broadcast(name + '.onClick');
  };

  const params = {
    css: launcherCSS + generateUserCSS(config.color),
    frameOffsetWidth: 5,
    frameOffsetHeight: 1,
    frameStyle: frameStyle,
    fullscreenable: false,
    hideCloseButton: true,
    name: name,
    position: config.position,
    transitions: {
      upShow: transitionFactory.webWidget.launcherUpShow(),
      downHide: transitionFactory.webWidget.launcherDownHide(),
      downShow: transitionFactory.webWidget.launcherDownShow(),
      upHide: transitionFactory.webWidget.launcherUpHide()
    },
    visible: config.visible
  };

  const component = (
    <Frame {...params} store={reduxStore}>
      <Launcher
        onClick={onClick}
        label={`embeddable_framework.launcher.label.${config.labelKey}`}
        icon={config.icon} />
    </Frame>
  );

  launchers[name] = {
    component: component,
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
  waitForRootComponent(name, () => {
    getRootComponent(name).setIcon(icon);
  });
}

function setHasUnreadMessages(name, unread) {
  waitForRootComponent(name, () => {
    getRootComponent(name).setState({ hasUnreadMessages: unread });
  });
}

function render(name) {
  if (launchers[name] && launchers[name].instance) {
    throw new Error(`Launcher ${name} has already been rendered.`);
  }

  const element = getDocumentHost().appendChild(document.createElement('div'));

  launchers[name].instance = ReactDOM.render(launchers[name].component, element);

  mediator.channel.subscribe(name + '.hide', (options = {}) => {
    waitForRootComponent(name, () => {
      get(name).instance.hide(options);
    });
  });

  mediator.channel.subscribe(name + '.show', (options = {}) => {
    waitForRootComponent(name, () => {
      get(name).instance.show(options);
    });
  });

  mediator.channel.subscribe(name + '.refreshLocale', () => {
    get(name).instance.updateFrameLocale();

    waitForRootComponent(name, () => {
      getRootComponent(name).forceUpdate();
    });
  });

  mediator.channel.subscribe(name + '.setLabelChat', () => {
    setIcon(name, 'Icon--chat');
    setLabel(name, 'embeddable_framework.launcher.label.chat');
    setHasUnreadMessages(name, false);
  });

  mediator.channel.subscribe(name + '.setLabelHelp', () => {
    const label = `embeddable_framework.launcher.label.${launchers[name].config.labelKey}`;

    setIcon(name, 'Icon');
    setLabel(name, label);
    setHasUnreadMessages(name, false);
  });

  mediator.channel.subscribe(name + '.setLabelChatHelp', () => {
    const label = `embeddable_framework.launcher.label.${launchers[name].config.labelKey}`;

    setIcon(name, 'Icon--chat');
    setLabel(name, label);
    setHasUnreadMessages(name, false);
  });

  mediator.channel.subscribe(name + '.setLabelUnreadMsgs', (unreadMsgs) => {
    const label = unreadMsgs > 1
                ? 'embeddable_framework.chat.notification_multiple'
                : 'embeddable_framework.chat.notification';
    const options = unreadMsgs > 1 ? { count: unreadMsgs } : {};

    setLabel(name, label, options);
    setHasUnreadMessages(name, true);
  });
}

function setLabel(name, label, options = {}) {
  waitForRootComponent(name, () => {
    getRootComponent(name).setLabel(label, options);
  });
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

export const launcher = {
  create: create,
  list: list,
  get: get,
  render: render,
  setIcon: setIcon,
  setLabel: setLabel
};

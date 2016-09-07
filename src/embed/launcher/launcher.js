import React from 'react';
import ReactDOM from 'react-dom';
import _     from 'lodash';

import { document,
         getDocumentHost } from 'utility/globals';
import { Launcher } from 'component/Launcher';
import { frameFactory } from 'embed/frameFactory';
import { beacon } from 'service/beacon';
import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { generateUserCSS } from 'utility/color';
import { transitionFactory } from 'service/transitionFactory';

const launcherCSS = require('./launcher.scss');
let launchers = {};

function create(name, config) {
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
    marginRight: '20px'
  };

  config = _.extend(configDefaults, config);

  const Embed = frameFactory((params) => {
      return (
        <Launcher
          ref='rootComponent'
          onClick={params.onClickHandler}
          onTouchEnd={params.onClickHandler}
          updateFrameSize={params.updateFrameSize}
          position={config.position}
          label={i18n.t(`embeddable_framework.launcher.label.${config.labelKey}`)}
          icon={config.icon} />
      );
    },
    {
      frameStyle: frameStyle,
      position: config.position,
      css: launcherCSS + generateUserCSS(config.color),
      name: name,
      hideCloseButton: true,
      fullscreenable: false,
      offsetWidth: 5,
      offsetHeight: 1,
      transitions: {
        upShow: transitionFactory.webWidget.launcherUpShow(),
        downHide: transitionFactory.webWidget.launcherDownHide()
      },
      extend: {
        onClickHandler: (e) => {
          e.preventDefault();

          beacon.trackUserAction('launcher', 'click', name);
          mediator.channel.broadcast(name + '.onClick');
        }
      }
    }
    );

  launchers[name] = {
    component: <Embed visible={config.visible} position={config.position} ><div ref='test'/></Embed>,
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

  mediator.channel.subscribe(name + '.setLabelChat', () => {
    setIcon(name, 'Icon--chat');
    setLabel(name, i18n.t('embeddable_framework.launcher.label.chat'));
    setHasUnreadMessages(name, false);
  });

  mediator.channel.subscribe(name + '.setLabelHelp', () => {
    const label = i18n.t(`embeddable_framework.launcher.label.${launchers[name].config.labelKey}`);

    setIcon(name, 'Icon');
    setLabel(name, label);
    setHasUnreadMessages(name, false);
  });

  mediator.channel.subscribe(name + '.setLabelChatHelp', () => {
    const label = i18n.t(`embeddable_framework.launcher.label.${launchers[name].config.labelKey}`);

    setIcon(name, 'Icon--chat');
    setLabel(name, label);
    setHasUnreadMessages(name, false);
  });

  mediator.channel.subscribe(name + '.setLabelUnreadMsgs', (unreadMsgs) => {
    const label = unreadMsgs > 1
                ? i18n.t(
                    'embeddable_framework.chat.notification_multiple',
                    { count: unreadMsgs, fallback: `${unreadMsgs} new` }
                )
                // TODO: Remove the count here when the notification translations changes are swept.
                : i18n.t('embeddable_framework.chat.notification', { count: 1 });

    setLabel(name, label);
    setHasUnreadMessages(name, true);
  });
}

function setLabel(name, label) {
  waitForRootComponent(name, () => {
    getRootComponent(name).setLabel(label);
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

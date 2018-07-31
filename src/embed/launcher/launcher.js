// Needed for legacy browsers as specified in
// https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es6/map';
import 'core-js/es6/set';

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
import { generateUserCSS } from 'utility/color/styles';
import { transitionFactory } from 'service/transitionFactory';
import { isMobileBrowser,
  getZoomSizingRatio } from 'utility/devices';
import { renewToken } from 'src/redux/modules/base';

const launcherCSS = `${require('globalCSS')} ${launcherStyles}`;

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
    // Re-authenticate user if their oauth token is within 20 minutes of expiring
    reduxStore.dispatch(renewToken());
  };
  const updateFrameTitle = (title) => {
    if (get(name).instance) {
      get(name).instance.updateFrameTitle(title);
    }
  };
  const adjustFrameStyleMargins = (frameStyle) => {
    const zoomRatio = getZoomSizingRatio();
    const adjustMargin = (margin) => {
      const adjustedMargin = Math.round(parseInt(margin, 10) * zoomRatio);

      return `${adjustedMargin}px`;
    };

    const result = _.chain(frameStyle)
      .pick(['marginTop', 'marginBottom', 'marginLeft', 'marginRight'])
      .mapValues(adjustMargin)
      .value();

    return _.extend({}, frameStyle, result);
  };

  const params = {
    css: launcherCSS + generateUserCSS(config.color),
    frameStyleModifier: isMobileBrowser() ? adjustFrameStyleMargins : () => {},
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
        updateFrameTitle={updateFrameTitle}
        label={`embeddable_framework.launcher.label.${config.labelKey}`} />
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
    waitForRootComponent(name, () => {
      get(name).instance.updateFrameLocale();
      getRootComponent(name).forceUpdate();
    });
  });

  mediator.channel.subscribe(name + '.setUnreadMsgs', (unreadMsgs) => {
    waitForRootComponent(name, () => {
      getRootComponent(name).setUnreadMessages(unreadMsgs);
    });
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
  render: render
};

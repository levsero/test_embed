// Needed for legacy browsers as specified in
// https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Provider } from 'react-redux';

import { launcherStyles } from './launcherStyles.js';
import { document,
  getDocumentHost } from 'utility/globals';
import Frame from 'component/frame/Frame';
import Launcher from 'component/launcher/Launcher';
import { beacon } from 'service/beacon';
import { mediator } from 'service/mediator';
import { generateUserLauncherCSS } from 'utility/color/styles';
import {
  isMobileBrowser,
  getZoomSizingRatio } from 'utility/devices';
import { renewToken } from 'src/redux/modules/base';
import {
  FRAME_OFFSET_WIDTH,
  FRAME_OFFSET_HEIGHT } from 'constants/launcher';

const launcherCSS = `${require('globalCSS')} ${launcherStyles}`;

let embed;

const getEmbedConfig = (config = {}) => {
  const configDefaults = {
    onClick: () => {},
    position: 'right',
    icon: 'Icon',
    labelKey: 'help',
    visible: true,
    color: '#659700'
  };

  return _.extend({}, configDefaults, config);
};

const adjustWidth = (frameStyle, el) => {
  const width = Math.max(el.clientWidth, el.offsetWidth);

  return {
    ...frameStyle,
    width: (_.isFinite(width) ? width : 0) + FRAME_OFFSET_WIDTH
  };
};

const adjustStylesForZoom = (frameStyle, el) => {
  const zoomRatio = getZoomSizingRatio();
  const adjustMargin = (margin) => {
    const adjustedMargin = Math.round(parseInt(margin, 10) * zoomRatio);

    return `${adjustedMargin}px`;
  };

  const result = _.chain(frameStyle)
    .pick(['marginTop', 'marginBottom', 'marginLeft', 'marginRight'])
    .mapValues(adjustMargin)
    .value();

  const height = {
    height: `${50*zoomRatio}px`
  };

  return _.extend({}, frameStyle, adjustWidth(frameStyle, el), result, height);
};

function create(name, config={}, reduxStore) {
  const embedConfig = getEmbedConfig(config);
  const { position, visible } = embedConfig;
  const isMobile = isMobileBrowser();
  const params = {
    ref: (el) => { embed.instance = el.getWrappedInstance(); },
    css: launcherCSS,
    generateUserCSS: generateUserLauncherCSS,
    frameStyleModifier: isMobile ? adjustStylesForZoom : adjustWidth,
    frameOffsetWidth: FRAME_OFFSET_WIDTH,
    frameOffsetHeight: FRAME_OFFSET_HEIGHT,
    fullscreenable: false,
    hideNavigationButtons: true,
    name: name,
    position: position,
    visible: visible,
    isMobile: isMobile,
    fullscreen: false
  };

  const onClickHandler = (e) => {
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

  const component = (
    <Provider store={reduxStore}>
      <Frame {...params} store={reduxStore}>
        <Launcher
          onClickHandler={onClickHandler}
          updateFrameTitle={updateFrameTitle}
          labelKey={`embeddable_framework.launcher.label.${embedConfig.labelKey}`}
          hideBranding={config.hideZendeskLogo}
          fullscreen={false}
          isMobile={isMobile} />
      </Frame>
    </Provider>
  );

  embed = {
    component: component,
    config: embedConfig
  };
}

function get() {
  return embed;
}

function getRootComponent() {
  return get().instance.getRootComponent();
}

function render() {
  if (embed && embed.instance) {
    throw new Error('Launcher has already been rendered.');
  }

  const element = getDocumentHost().appendChild(document.createElement('div'));

  ReactDOM.render(embed.component, element);

  mediator.channel.subscribe('launcher.updateSettings', () => {
    waitForRootComponent(() => {
      embed.instance.forceUpdateWorld();
    });
  });

  mediator.channel.subscribe('launcher.refreshLocale', () => {
    waitForRootComponent(() => {
      get().instance.updateFrameLocale();
      getRootComponent('launcher').forceUpdate();
    });
  });

  mediator.channel.subscribe('launcher.setUnreadMsgs', (unreadMsgs) => {
    waitForRootComponent(() => {
      getRootComponent().setUnreadMessages(unreadMsgs);
      get().instance.forceUpdateWorld();
    });
  });
}

function waitForRootComponent(callback) {
  if (getRootComponent()) {
    callback();
  } else {
    setTimeout(() => {
      waitForRootComponent(callback);
    }, 0);
  }
}

export const launcher = {
  create: create,
  get: get,
  render: render
};

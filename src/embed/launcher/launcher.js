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
import Launcher from 'component/Launcher';
import { beacon } from 'service/beacon';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
import { generateUserLauncherCSS } from 'utility/color/styles';
import { isMobileBrowser,
  getZoomSizingRatio } from 'utility/devices';
import { renewToken } from 'src/redux/modules/base';

const launcherCSS = `${require('globalCSS')} ${launcherStyles}`;

let embed;

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
    height: '50px',
    minHeight: '50px',
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: '20px',
    marginRight: '20px',
    zIndex: settings.get('zIndex') - 1
  };

  config = _.extend(configDefaults, config);

  const frameOffsetWidth = 5;
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
  const adjustWidth = (frameStyle, el) => {
    const width = Math.max(el.clientWidth, el.offsetWidth);

    return {
      ...frameStyle,
      width: (_.isFinite(width) ? width : 0) + frameOffsetWidth
    };
  };

  const params = {
    ref: (el) => { embed.instance = el.getWrappedInstance(); },
    css: launcherCSS + generateUserLauncherCSS(config.color),
    frameStyleModifier: isMobileBrowser() ? adjustStylesForZoom : adjustWidth,
    frameOffsetWidth,
    frameOffsetHeight: 1,
    frameStyle: frameStyle,
    fullscreenable: false,
    hideCloseButton: true,
    name: name,
    position: config.position,
    visible: config.visible
  };

  const component = (
    <Provider store={reduxStore}>
      <Frame {...params} store={reduxStore}>
        <Launcher
          onClick={onClick}
          updateFrameTitle={updateFrameTitle}
          label={`embeddable_framework.launcher.label.${config.labelKey}`} />
      </Frame>
    </Provider>
  );

  embed = {
    component: component,
    config: config
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

  mediator.channel.subscribe('launcher.hide', (options = {}) => {
    waitForRootComponent(() => {
      get().instance.hide(options);
    });
  });

  mediator.channel.subscribe('launcher.show', (options = {}) => {
    waitForRootComponent(() => {
      get('launcher').instance.show(options);
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

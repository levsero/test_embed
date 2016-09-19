import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { ChannelChoice } from 'component/channelChoice/ChannelChoice';
import { frameFactory } from 'embed/frameFactory';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
import { transitionFactory } from 'service/transitionFactory';
import { generateUserCSS } from 'utility/color';
import { isIE,
         isMobileBrowser } from 'utility/devices';
import { document,
         getDocumentHost,
         location } from 'utility/globals';

let channelChoices = {};

const channelChoiceCSS = require('./channelChoice.scss');

function create(name, config) {
  let containerStyle;
  let frameStyle = {};

  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    frameStyle.width = 342;
    frameStyle.marginLeft = settings.get('margin');
    frameStyle.marginRight = settings.get('margin');
    containerStyle = { width: 342 };
  }

  const frameParams = {
    name: name,
    onClose() {
      mediator.channel.broadcast(name + '.onClose');
    },
    css: channelChoiceCSS,
    fullscreenable: true,
    transitions: {
      close: transitionFactory.webWidget.downHide(),
      downHide: transitionFactory.webWidget.downHide(),
      downShow: transitionFactory.webWidget.downShow(),
      upShow: transitionFactory.webWidget.upShow()
    },
    frameStyle: frameStyle
  };

  const onClickChat = function() {
    mediator.channel.broadcast(name + '.onNextClick', 'chat');
  };
  const onClickTicket = function() {
    mediator.channel.broadcast(name + '.onNextClick', 'submitTicket');
  };

  const Embed = frameFactory(
    (params) => {
      return (
        <ChannelChoice
          ref='rootComponent'
          updateFrameSize={params.updateFrameSize}
          style={containerStyle}
          handleOnClickChat={onClickChat}
          handleOnClickTicket={onClickTicket} />
      );
    },
    frameParams
  );

  channelChoices[name] = {
    component: <Embed visible={false} />,
    config: config
  };

  return this;
}

function list() {
  return channelChoices;
}

function get(name) {
  return channelChoices[name];
}

function getRootComponent(name) {
  return get(name).instance.getRootComponent();
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

function render(name) {
  if (channelChoices[name] && channelChoices[name].instance) {
    throw new Error(`ChannelChoice ${name} has already been rendered.`);
  }

  const element = getDocumentHost().appendChild(document.createElement('div'));

  channelChoices[name].instance = ReactDOM.render(channelChoices[name].component, element);

  mediator.channel.subscribe(name + '.show', function(options = {}) {
    waitForRootComponent(name, () => {
      channelChoices[name].instance.show(options);
    });
  });

  mediator.channel.subscribe(name + '.hide', function(options = {}) {
    waitForRootComponent(name, () => {
      channelChoices[name].instance.hide(options);
    });
  });
}

export const channelChoice = {
  create: create,
  list: list,
  get: get,
  render: render,
  postRender: () => {}
};

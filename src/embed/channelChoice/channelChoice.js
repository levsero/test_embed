import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { ChannelChoice } from 'component/channelChoice/ChannelChoice';
import { frameFactory } from 'embed/frameFactory';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
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
    containerStyle = { width: 342, margin: settings.get('margin') };
  }

  const frameParams = {
    name: name,
    onClose() {
      mediator.channel.broadcast(name + '.onClose');
    },
    css: channelChoiceCSS,
    frameStyle: frameStyle
  };

  const onNextClickChat = function() {
    mediator.channel.broadcast(name + '.onNextClickChat');
  };
  const onNextClickTicket = function() {
    mediator.channel.broadcast(name + '.onNextClickTicket');
  };

  const Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <ChannelChoice
          ref='rootComponent'
          updateFrameSize={params.updateFrameSize}
          style={containerStyle}
          handleOnClickChat={onNextClickChat}
          handleOnClickTicket={onNextClickTicket} />
      );
    },
    frameParams
  ));

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
}

function postRender(name) {
  // const config = get(name).config;
}

export const channelChoice = {
  create: create,
  list: list,
  get: get,
  render: render,
  postRender: postRender
};

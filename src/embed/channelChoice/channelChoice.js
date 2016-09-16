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

function create(name, config) {
  const frameParams = {
    name: name
  };

  const Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <ChannelChoice
          ref='rootComponent'
          updateFrameSize={params.updateFrameSize} />
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

import React from 'react';
import ReactDOM from 'react-dom';
import _     from 'lodash';

import { Ipm } from 'component/ipm/Ipm';
import { frameFactory } from 'embed/frameFactory';
import { mediator } from 'service/mediator';
import { transitionFactory } from 'service/transitionFactory';
import { transport } from 'service/transport';
import { isMobileBrowser } from 'utility/devices';
import { document,
         getDocumentHost,
         location } from 'utility/globals';

const ipmCSS = require('./ipm.scss').toString();

let ipmes = {};
let hasSeenIpm = false;

function create(name, config, reduxStore) {
  let containerStyle;
  let frameStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 2147483647,
    marginRight: 15
  };

  const configDefaults = {
    hideZendeskLogo: false
  };

  config = _.extend(configDefaults, config);

  const ipmSender = (params) => {
    const payload = {
      path: '/embeddable/ipm',
      method: 'post',
      params: params
    };

    transport.send(payload);
  };

  const onShow = (frame) => {
    const rootComponent = frame.getRootComponent();

    mediator.channel.broadcast('ipm.onShow');
    rootComponent.ipmSender('seen');

    hasSeenIpm = true;
  };

  const onClose = (frame, options) => {
    const rootComponent = frame.getRootComponent();

    mediator.channel.broadcast('ipm.onClose');
    rootComponent.ipmSender(options.eventToEmit || 'dismissed');
  };

  const closeFrame = () => get(name).instance.close(null, { eventToEmit: 'clicked' });

  const transitionSet = transitionFactory.ipm;

  const frameParams = {
    frameStyle: frameStyle,
    css: ipmCSS,
    hideCloseButton: false,
    name: name,
    fullscreenable: false,
    onClose,
    onShow,
    offsetHeight: 52, // the avatar is positioned -32 from the top so we need to account for that here.
    transitions: {
      upHide: transitionSet.upHide(),
      downShow: transitionSet.downShow(),
      close: transitionSet.upHide()
    }
  };

  const Embed = frameFactory(
    (params) => {
      return (
        <Ipm
          ref='rootComponent'
          setFrameSize={params.setFrameSize}
          updateFrameSize={params.updateFrameSize}
          ipmSender={ipmSender}
          closeFrame={closeFrame}
          mobile={isMobileBrowser()}
          style={containerStyle} />
      );
    },
    frameParams,
    reduxStore
  );

  ipmes[name] = {
    component: <Embed visible={false} />,
    config: config
  };
}

function get(name) {
  return ipmes[name];
}

function render(name) {
  const element = getDocumentHost().appendChild(document.createElement('div'));

  ipmes[name].instance = ReactDOM.render(ipmes[name].component, element);

  mediator.channel.subscribe('ipm.setIpm', (params) => {
    const ipm = ipmes[name].instance.getRootComponent();
    const ipmContent = params.pendingCampaign || {};
    const color = ipmContent.message && ipmContent.message.color;

    if (color) {
      ipmes[name].instance.setHighlightColor(color);
    }

    if (ipmContent && ipmContent.id) {
      ipm.setState({
        ipm: _.extend({}, ipmContent),
        ipmAvailable: true,
        url: location.href
      });
    } else {
      ipm.setState({
        ipmAvailable: false
      });
    }
  });

  mediator.channel.subscribe('ipm.activate', function() {
    const ipm = ipmes[name].instance.getRootComponent();

    if (ipm.state.ipmAvailable && !hasSeenIpm) {
      ipmes[name].instance.show({transition: 'downShow'});
    } else if (ipm.state.ipmAvailable === null) {
      const err = new Error([
        'An error occurred in your use of the Zendesk Widget API:',
        'zE.activateIpm()',
        'No campaigns available. Run zE.identify() first.',
        'Check out the Developer API docs to make sure you\'re using it correctly',
        'https://developer.zendesk.com/embeddables/docs/widget/api'
      ].join('\n\n'));

      err.special = true;

      throw err;
    }
  });

  mediator.channel.subscribe('ipm.show', function(options = {}) {
    ipmes[name].instance.show(options);
  });

  mediator.channel.subscribe('ipm.hide', function(options = {}) {
    ipmes[name].instance.hide(options);
  });
}

export const ipm = {
  create: create,
  get: get,
  render: render
};

import React from 'react/addons';
import _     from 'lodash';

import { frameFactory }     from 'embed/frameFactory';
import { Ipm }              from 'component/Ipm';
import { mediator }         from 'service/mediator';
import { transport }        from 'service/transport';
import { transitionFactory } from 'service/transitionFactory';
import { document,
         getDocumentHost } from 'utility/globals';
import { isMobileBrowser } from 'utility/devices';

const ipmCSS = require('./ipm.scss');

let ipmes = {};

function create(name, config) {
  let containerStyle;
  let frameStyle = {
    position: 'fixed',
    top: 0,
    right: 0
  };

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
  };

  const onClose = (frame) => {
    const rootComponent = frame.getRootComponent();

    mediator.channel.broadcast('ipm.onClose');
    rootComponent.ipmSender('dismissed');
  };

  const transitionSet = transitionFactory.ipm;

  const frameParams = {
    frameStyle: frameStyle,
    css: ipmCSS,
    hideCloseButton: false,
    name: name,
    fullscreenable: false,
    onClose,
    onShow,
    transitions: {
      upHide: transitionSet.upHide(),
      downShow: transitionSet.downShow(),
      close: transitionSet.upHide()
    }
  };

  const Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <Ipm
          ref='rootComponent'
          setFrameSize={params.setFrameSize}
          updateFrameSize={params.updateFrameSize}
          setOffsetHorizontal={params.setOffsetHorizontal}
          ipmSender={ipmSender}
          mobile={isMobileBrowser()}
          style={containerStyle} />
      );
    },
    frameParams
  ));

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

  ipmes[name].instance = React.render(ipmes[name].component, element);

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
        url: document.referrer
      });
    } else {
      ipm.setState({
        ipmAvailable: false
      });
    }
  });

  mediator.channel.subscribe('ipm.activate', function() {
    const ipm = ipmes[name].instance.getRootComponent();

    if (ipm.state.ipmAvailable) {
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

import React from 'react/addons';
import _     from 'lodash';

import { frameFactory }     from 'embed/frameFactory';
import { Ipm }              from 'component/Ipm';
import { mediator }         from 'service/mediator';
import { transport }        from 'service/transport';
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

  const ipmSender = (params, doneFn, failFn) => {
    const payload = {
      path: '/embeddable/ipm',
      method: 'post',
      params: params,
      callbacks: {
        done: doneFn,
        fail: failFn
      }
    };

    if (__DEV__) {
      setTimeout(doneFn, 1000);
    } else {
      transport.sendWithMeta(payload, 1);
    }
  };

  const onShow = () => {
    mediator.channel.broadcast('ipm.onShow');
  };

  const onClose = () => {
    mediator.channel.broadcast('ipm.onClose');
  };

  const frameParams = {
    frameStyle: frameStyle,
    css: ipmCSS,
    hideCloseButton: false,
    name: name,
    fullscreenable: false,
    onClose,
    onShow
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
    const ipmContent = params.ipm || {};

    if (ipmContent.buttonColor) {
      ipmes[name].instance.setHighlightColor(ipmContent.buttonColor);
    }

    if (ipmContent && ipmContent.id) {
      ipm.setState({
        ipm: _.extend({}, ipm.state.ipm, ipmContent),
        ipmAvailable: true
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
      ipmes[name].instance.show();
    } else if (ipm.state.ipmAvailable === null) {
      const err = new Error([
        'An error occurred in your use of the Zendesk Widget API:',
        'zE.activateIpm()',
        'No survey available. Run zE.identify() first.',
        'Check out the Developer API docs to make sure you\'re using it correctly',
        'https://developer.zendesk.com/embeddables/docs/widget/api'
      ].join('\n\n'));
      err.special = true;

      throw err;
    }
  });

  mediator.channel.subscribe('ipm.show', function() {
    ipmes[name].instance.show();
  });

  mediator.channel.subscribe('ipm.hide', function() {
    ipmes[name].instance.hide();
  });
}

export var ipm = {
  create: create,
  get: get,
  render: render
};

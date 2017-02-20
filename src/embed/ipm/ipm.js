import React from 'react';
import ReactDOM from 'react-dom';
import _     from 'lodash';

import { Ipm } from 'component/ipm/Ipm';
import { frameFactory } from 'embed/frameFactory';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
import { transitionFactory } from 'service/transitionFactory';
import { isMobileBrowser } from 'utility/devices';
import { document,
         getDocumentHost,
         location } from 'utility/globals';
import { transport } from 'service/transport';
import { logging } from 'service/logging';
import { identity } from 'service/identity';
import apiGet from 'embed/ipm/apiGet';

import AvatarStyles from 'component/Avatar.sass';

const ipmCSS = `
  ${AvatarStyles}
  ${require('./ipm.scss')}
`;

const CONNECT_API_CONFIG_PATH = '/connect/api/ipm/config.json';
const CONNECT_API_PENDING_CAMPAIGN_PATH = '/connect/api/ipm/pending_campaign.json';

let ipmes = {};
let hasSeenIpm = false;
let hasSentIdentify = false;
let ipmConfig;

function create(name, config, reduxStore) {
  let containerStyle;
  let frameStyle = {
    position: 'fixed',
    top: settings.get('offset.vertical', 'ipm'),
    right: settings.get('offset.horizontal', 'ipm'),
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

  ipmConfig = apiGet(CONNECT_API_CONFIG_PATH).catch((err) => {
    logging.error({ error: err });
    return {};
  });

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

function waitForRootComponent(name) {
  return new Promise((resolve) => {
    const checkForRootComponent = () => {
      const rootComponent = get(name).instance.getRootComponent();

      if (rootComponent) {
        resolve(rootComponent);
      } else {
        setTimeout(checkForRootComponent, 0);
      }
    };

    checkForRootComponent();
  });
}

async function setIpm(ipmContent, name) {
  const ipm = await waitForRootComponent(name);
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
}

async function showIpm(name) {
  const ipm = await waitForRootComponent(name);

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
}

function checkAnonymousPendingCampaign() {
  return (
    apiGet(CONNECT_API_PENDING_CAMPAIGN_PATH, { anonymousId: identity.getBuid() })
      .catch((err) => {
        // Ignore 404 errors, as this is the API's way of telling us there are no pending campaigns
        if (err.message === 'Not Found') {
          return {};
        }

        throw err;
      })
  );
}

async function activateIpm(name) {
  if (hasSentIdentify) {
    await showIpm(name);
  } else {
    const { anonymousCampaignsAllowed } = await ipmConfig;

    if (anonymousCampaignsAllowed) {
      const { pendingCampaign } = await checkAnonymousPendingCampaign();

      if (pendingCampaign) {
        await setIpm(pendingCampaign, name);
        await showIpm(name);
      }
    }
  }
}

function render(name) {
  const element = getDocumentHost().appendChild(document.createElement('div'));

  ipmes[name].instance = ReactDOM.render(ipmes[name].component, element);

  mediator.channel.subscribe('ipm.identifying', () => {
    hasSentIdentify = true;
  });

  mediator.channel.subscribe('ipm.setIpm', ({ pendingCampaign = {} }) => {
    setIpm(pendingCampaign, name);
  });

  mediator.channel.subscribe('ipm.activate', () => {
    activateIpm(name);
  });

  mediator.channel.subscribe('ipm.show', function(options = {}) {
    ipmes[name].instance.show(options);
  });

  mediator.channel.subscribe('ipm.hide', function(options = {}) {
    ipmes[name].instance.hide(options);
  });
}

export const ipm = {
  create,
  get,
  render,

  // for testing
  CONNECT_API_CONFIG_PATH,
  CONNECT_API_PENDING_CAMPAIGN_PATH,
  activateIpm,
  setIpm
};

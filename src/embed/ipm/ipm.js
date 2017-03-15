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
import { identity } from 'service/identity';
import { api } from 'embed/ipm/api';

import AvatarStyles from 'component/Avatar.sass';

const ipmCSS = `
  ${AvatarStyles}
  ${require('./ipm.scss')}
`;

const connectApiPendingCampaignPath = '/connect/api/ipm/pending_campaign.json';
const connectApiCampaignEventsPath = '/connect/api/ipm/campaign_events.json';

let ipmes = {};
let hasSeenIpm = false;
let hasSentIdentify = false;
let identifiedEmail;

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
    api.post(connectApiCampaignEventsPath, params);
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

function waitForRootComponent(name, callback) {
  const checkForRootComponent = () => {
    const rootComponent = get(name).instance.getRootComponent();

    if (rootComponent) {
      callback(rootComponent);
    } else {
      setTimeout(checkForRootComponent, 0);
    }
  };

  checkForRootComponent();
}

function setIpm(ipmContent, name, ipm) {
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

function showIpm(name, ipm) {
  if (ipm.state.ipmAvailable && !hasSeenIpm) {
    ipmes[name].instance.show({ transition: 'downShow' });
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

function checkPendingCampaign(params, name) {
  return (
    api.get(connectApiPendingCampaignPath, params, ({ pendingCampaign }) => {
      if (pendingCampaign) {
        waitForRootComponent(name, (ipm) => {
          setIpm(pendingCampaign, name, ipm);
          showIpm(name, ipm);
        });
      }
    }, (err) => {
      // Ignore 404 errors, as this is the API's way of telling us there are no pending campaigns
      if (err.message === 'Not Found') {
        return;
      }

      throw err;
    })
  );
}

function checkAnonymousPendingCampaign(name) {
  return checkPendingCampaign({ anonymousId: identity.getBuid() }, name);
}

function activateIpm(name) {
  const { anonymousCampaigns, fetchDirectlyFromConnect } = get(name).config;

  if (fetchDirectlyFromConnect) {
    if (identifiedEmail) {
      checkPendingCampaign({ email: identifiedEmail }, name);
    } else if (anonymousCampaigns) {
      checkAnonymousPendingCampaign(name);
    }
  } else {
    oldActivateIpm(name);
  }
}

// TODO: Delete this once "people_fetch_ipm_directly" is GA'd
function oldActivateIpm(name) {
  if (hasSentIdentify) {
    waitForRootComponent(name, (ipm) => {
      showIpm(name, ipm);
    });
  } else {
    const { anonymousCampaigns } = get(name).config;

    if (anonymousCampaigns) {
      checkAnonymousPendingCampaign(name);
    }
  }
}

function render(name) {
  const element = getDocumentHost().appendChild(document.createElement('div'));

  ipmes[name].instance = ReactDOM.render(ipmes[name].component, element);

  mediator.channel.subscribe('ipm.identifying', ({ email }) => {
    hasSentIdentify = true;
    identifiedEmail = email;
  });

  mediator.channel.subscribe('ipm.setIpm', ({ pendingCampaign = {} }) => {
    waitForRootComponent(name, (ipm) => {
      setIpm(pendingCampaign, name, ipm);
    });
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
  connectApiPendingCampaignPath,
  connectApiCampaignEventsPath,
  activateIpm,
  setIpm
};

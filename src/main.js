module React from 'react';
import { beacon         } from 'service/beacon';
import { renderer       } from 'service/renderer';
import { transport      } from 'service/transport';
import { win            } from 'util/globals';
import { getSizingRatio } from 'util/devices';

require('imports?_=lodash!lodash');

function boot() {
  var publicApi,
      isPinching;

  React.initializeTouchEvents(true);

  transport.bustCache();

  transport.init({ zendeskHost: document.zendeskHost });
  beacon.init().send();

  publicApi = {
    devRender: renderer.init,
    bustCache: transport.bustCache
  };

  if (win.zE === win.zEmbed) {
    win.zE = win.zEmbed = publicApi;
  } else {
    win.zEmbed = publicApi;
  }

  _.forEach(document.zEQueue, function(item) {
    if (item[0] === 'ready') {
      item[1](win.zEmbed);
    }
  });

  // Until transport config is setup we hard code the config call
  renderer.init({
    'ticketSubmissionForm': {
      'embed': 'submitTicket',
      'props': {
        'onShow': {
          name: 'ticketSubmissionLauncher',
          method: 'update'
        },
        'onHide': {
          name: 'ticketSubmissionLauncher',
          method: 'update'
        }
      }
    },
    'ticketSubmissionLauncher': {
      'embed': 'launcher',
      'props': {
        'position': 'right',
        'onClick': {
          name: 'ticketSubmissionForm',
          method: 'update'
        }
      }
    }
  });

  function propagateFontRatioChange() {
    setTimeout(() => {
      renderer.propagateFontRatio(getSizingRatio(true));
    }, 0);
  }

  win.addEventListener('touchmove', (e) => {
    // Touch end won't tell you if multiple touches are detected
    // so we store the touches length on move and check on end
    isPinching = e.touches.length > 1;
  });

  win.addEventListener('touchend', (e) => {
    // iOS has the scale property to detect pinching gestures
    if (isPinching || e.scale && e.scale !== 1) {
      propagateFontRatioChange();
    }
  });

  win.addEventListener('orientationchange', () => {
    propagateFontRatioChange();
  });

}

if (!_.isUndefined(document.zendeskHost)) {
  boot();
}

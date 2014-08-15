module React from 'react';
import { beacon         } from 'service/beacon';
import { renderer       } from 'service/renderer';
import { transport      } from 'service/transport';
import { win, location  } from 'util/globals';
import { getSizingRatio } from 'util/devices';

require('imports?_=lodash!lodash');

function boot() {
  var publicApi,
      isPinching,
      rendererConfig,
      host = location.host,
      path = location.pathname,
      chatPages = [
      '/zopim',
      '/product/pricing',
      '/register',
      '/plus',
      '/enterprise'
      ];

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
  rendererConfig = {
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
  };

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

  // Until transport config is dynamic we need to alter what gets rendered on the zopim page
  if ((host === 'www.zendesk.com' && _.contains(chatPages, path)) ||
      (host === 'snow.hashttp.com' && path === '/chat')) {

    /* jshint laxbreak: true */
    var zopimId = (host === 'www.zendesk.com')
                ? '25a9y1btM6rnjyOk0tRGQ8B9XMnqKAEG' //'2ItCA9Tu3W5bksDB4EJzPSCz4kIymONo'
                : '2EkTn0An31opxOLXuGgRCy5nPnSNmpe6';

    rendererConfig = {
      'zopimChat': {
        'embed': 'chat',
        'props': {
          'zopimId': zopimId,
          'onShow': {
            name: 'chatLauncher',
            method: 'update'
          },
          'onHide': {
            name: 'chatLauncher',
            method: 'update'
          },
          'setIcon': {
            name: 'chatLauncher',
            method: 'setIcon'
          },
          'setLabel': {
            name: 'chatLauncher',
            method: 'setLabel'
          },
          'updateForm': {
            name: 'ticketSubmissionForm',
            method: 'update'
          }
        }
      },
      'chatLauncher': {
        'embed': 'launcher',
        'props': {
          'position': 'right',
          'onClick': {
            name: 'zopimChat',
            method: 'update'
          }
        }
      },
      'ticketSubmissionForm': {
        'embed': 'submitTicket',
        'props': {
          'onShow': {
            name: 'chatLauncher',
            method: 'update'
          },
          'onHide': {
            name: 'chatLauncher',
            method: 'update'
          }
        }
      }
    };
  }

  renderer.init(rendererConfig);
}

if (!_.isUndefined(document.zendeskHost)) {
  boot();
}

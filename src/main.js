module React from 'react';

import { beacon }         from 'service/beacon';
import { logging }        from 'service/logging';
import { renderer }       from 'service/renderer';
import { transport }      from 'service/transport';
import { win, location }  from 'utility/globals';
import { getSizingRatio } from 'utility/devices';

require('imports?_=lodash!lodash');

function boot() {
  var publicApi,
      isPinching,
      rendererConfig,
      rendererPayload,
      host = location.host,
      path = location.pathname,
      chatPages = [
      '/zopim',
      '/product/pricing',
      '/product/tour',
      '/register',
      '/plus',
      '/enterprise'
      ];

  React.initializeTouchEvents(true);

  logging.init();

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

  rendererPayload = {
    method: 'get',
    path: '/embeddable/config',
    callbacks: {
      done(config) {
        renderer.init(JSON.parse(config));
      },
      fail(error) {
        Airbrake.push({
          error: error,
          context: {
            account: document.zendeskHost
          }
        });
      }
    }
  };

  if (host === 'support.zendesk.com' || host === 'snow.hashttp.com' ||
      host === 'developer.zendesk.com' || host === 'www.zendesk.com' ||
      host === 'herculespreprod.zendesk.com') {
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
    // Until transport config is dynamic we need to alter what gets rendered on the zopim page
    if ((host === 'www.zendesk.com' && _.contains(chatPages, path)) ||
        (host === 'snow.hashttp.com' && path === '/chat') ||
        (host === 'developer.zendesk.com') ||
        (host === 'herculespreprod.zendesk.com')) {

      var zopimId;

      if (host === 'www.zendesk.com') {
        zopimId = '2ItCA9Tu3W5bksDB4EJzPSCz4kIymONo';
      } else if (host === 'developer.zendesk.com' || host === 'herculespreprod.zendesk.com') {
        zopimId = '1uJgTSshB9yCQX0rbNnPCE7pttL4R3fb';
      } else {
        zopimId = '2EkTn0An31opxOLXuGgRCy5nPnSNmpe6';
      }

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
  } else {
    transport.send(rendererPayload);
  }

  function propagateFontRatioChange() {
    setTimeout(() => {
      renderer.propagateFontRatio(getSizingRatio(true));
    }, 0);
  }

  win.addEventListener('touchmove', Airbrake.wrap((e) => {
    // Touch end won't tell you if multiple touches are detected
    // so we store the touches length on move and check on end
    isPinching = e.touches.length > 1;
  }));

  win.addEventListener('touchend', Airbrake.wrap((e) => {
    // iOS has the scale property to detect pinching gestures
    if (isPinching || e.scale && e.scale !== 1) {
      propagateFontRatioChange();
    }
  }));

  win.addEventListener('orientationchange', () => {
    propagateFontRatioChange();
  });
}

if (!_.isUndefined(document.zendeskHost)) {
  try {
    boot();
  } catch (err) {
    Airbrake.push({
      error: err
    });
  }
}

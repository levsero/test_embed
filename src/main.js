module React from 'react';

import { beacon }             from 'service/beacon';
import { logging }            from 'service/logging';
import { renderer }           from 'service/renderer';
import { transport }          from 'service/transport';
import { i18n }               from 'service/i18n';
import { win, location }      from 'utility/globals';
import { mediator }           from 'service/mediator';
import { getSizingRatio,
         isMobileBrowser,
         isBlacklisted }      from 'utility/devices';
import { clickBusterHandler } from 'utility/utils';

require('imports?_=lodash!lodash');

function boot() {
  var publicApi,
      isPinching,
      host = location.host,
      path = location.pathname,
      postRenderQueue = [],
      chatPages = [
        '/zopim',
        '/product/pricing',
        '/product/tour',
        '/register',
        '/plus',
        '/enterprise'
      ],
      handleQueue = function(queue) {
        _.forEach(queue, function(item) {
          if (item[0].locale) {
            i18n.setLocale(item[0].locale);
          } else if (_.isFunction(item[0])) {
            postRenderQueue.push(item[0]);
          } else if (item[0] === 'ready' && _.isFunction(item[1])) {
            //to make it back-compatible so we don't break hercules
            postRenderQueue.push(item[1]);
          }
        });
      },
      handlePostRenderQueue = function(postRenderQueue) {
        _.forEach(postRenderQueue, function(callback) {
          callback();
        });
      },
      propagateFontRatioChange = function() {
        setTimeout(() => {
          renderer.propagateFontRatio(getSizingRatio(true));
        }, 0);
      };

  React.initializeTouchEvents(true);

  logging.init();

  transport.bustCache(__EMBEDDABLE_VERSION__);
  transport.init({ zendeskHost: document.zendeskHost });

  beacon.init().send();

  publicApi = {
    devRender: renderer.init,
    bustCache: transport.bustCache,
    version: __EMBEDDABLE_VERSION__,
    identify: identify
  };

  if (win.zE === win.zEmbed) {
    win.zE = win.zEmbed = function(callback) {
      callback();
    };
  } else {
    win.zEmbed = function(callback) {
      callback();
    };
  }

  _.extend(win.zEmbed, publicApi);

  handleQueue(document.zEQueue, postRenderQueue);

  if (!isBlacklisted()) {
    //The config for zendesk.com
    if (host === 'www.zendesk.com' && _.contains(chatPages, path)) {
      renderer.init(renderer.hardcodedConfigs.zendeskWithChat);
      handlePostRenderQueue(postRenderQueue);
    } else {
      transport.get({
        method: 'get',
        path: '/embeddable/config',
        callbacks: {
          done(res) {
            renderer.init(res.body);
            handlePostRenderQueue(postRenderQueue);
          },
          fail(error) {
            logging.error({
              error: error,
              context: {
                account: document.zendeskHost
              }
            });
          }
        }
      });
    }
  }

  function identify(user) {
    mediator.channel.broadcast('.identify', user);
  }

  if (isMobileBrowser()) {
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

    win.addEventListener('click', clickBusterHandler, true);
  }
}

if (!_.isUndefined(document.zendeskHost)) {
  try {
    boot();
  } catch (err) {
    logging.error({
      error: err
    });
  }
}

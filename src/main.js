module React from 'react';

import { beacon }             from 'service/beacon';
import { logging }            from 'service/logging';
import { renderer }           from 'service/renderer';
import { transport }          from 'service/transport';
import { i18n }               from 'service/i18n';
import { win, location }      from 'utility/globals';
import { getSizingRatio,
         isMobileBrowser,
         isBlacklisted }      from 'utility/devices';
import { clickBusterHandler } from 'utility/utils';

require('imports?_=lodash!lodash');

function boot() {
  var publicApi,
      isPinching,
      rendererPayload,
      host = location.host,
      path = location.pathname,
      locale,
      postRenderQueue = [],
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

  transport.bustCache(__EMBEDDABLE_VERSION__);
  transport.init({ zendeskHost: document.zendeskHost });

  beacon.init().send();

  publicApi = {
    devRender: renderer.init,
    bustCache: transport.bustCache
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

  if (locale && locale !== 'en-US') {
    i18n.setLocale(locale);
  }

  if (!isBlacklisted()) {
    rendererPayload = {
      method: 'get',
      path: '/embeddable/config',
      callbacks: {
        done(res) {
          renderer.init(res.body);
          processPostRenderQueue(postRenderQueue);
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

    //The config for zendesk.com
    if (host === 'www.zendesk.com' && _.contains(chatPages, path)) {
      renderer.init(renderer.hardcodedConfigs.zendeskWithChat);
      processPostRenderQueue(postRenderQueue);
    } else {
      transport.get(rendererPayload);
    }
  }

  function propagateFontRatioChange() {
    setTimeout(() => {
      renderer.propagateFontRatio(getSizingRatio(true));
    }, 0);
  }

  function processPostRenderQueue(postRenderQueue) {
    _.forEach(postRenderQueue, function(callback) {
      callback(win.zEmbed);
    });
  }

  function handleQueue(queue, postRenderQueue) {
    _.forEach(queue, function(item) {
      if (item[0].locale) {
        locale = item[0].locale;
      } else if (_.isFunction(item[0])) {
        postRenderQueue.push(item[0]);
      } else if (item[0] === 'ready' && _.isFunction(item[1])) {
        postRenderQueue.push(item[1]);
      }
    });
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
    Airbrake.push({
      error: err
    });
  }
}

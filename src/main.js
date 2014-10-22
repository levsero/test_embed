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
      devApi,
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
          try {
            if (item[0].locale) {
              // Backwards compat with zE({locale: 'zh-CN'}) calls
              i18n.setLocale(item[0].locale);
            } else {
              item[0]();
            }
          } catch(e) {
            if(e instanceof TypeError) {
              logging.error({error: e});
            }
          }
        });
      },
      handlePostRenderQueue = function(postRenderQueue) {
        _.forEach(postRenderQueue, function(method) {
          try {
            win.zE[method[0]](...method[1]);
          } catch(e) {
            // handle backwards compat for inbox
            if(method[0] === 'ready' && _.isFunction(method[1])) {
              method[1]();
            } else if(e instanceof TypeError) {
              logging.error({
                error: {
                  message: `Tried calling ${method[0]} on public API`
                }
              });
            }
          }
        });
      },
      identify = function(user) {
        mediator.channel.broadcast('.identify', user);
      },
      propagateFontRatioChange = function() {
        setTimeout(() => {
          renderer.propagateFontRatio(getSizingRatio(true));
        }, 0);
      },
      activate = function() {
        mediator.channel.broadcast('.activate');
      },
      hide = function() {
        mediator.channel.broadcast('.hide');
      };

  React.initializeTouchEvents(true);

  logging.init();

  transport.bustCache(__EMBEDDABLE_VERSION__);
  transport.init({ zendeskHost: document.zendeskHost });

  beacon.init().send();

  publicApi = {
    version:   __EMBEDDABLE_VERSION__,
    setLocale: i18n.setLocale,
    identify:  postRenderQueueCallback.bind('identify'),
    activate:  postRenderQueueCallback.bind('activate'),
    hide:      postRenderQueueCallback.bind('hide')
  };

  if(__DEV__) {
    devApi = {
      devRender: renderer.init,
      bustCache: transport.bustCache
    };
  }

  if (win.zE === win.zEmbed) {
    win.zE = win.zEmbed = function(callback) {
      callback();
    };
  } else {
    win.zEmbed = function(callback) {
      callback();
    };
  }

  function postRenderQueueCallback(...args) {
    // "this" is bound to the method name
    postRenderQueue.push([this, args]);
  }

  _.extend(win.zEmbed, publicApi, devApi);

  handleQueue(document.zEQueue, postRenderQueue);

  // Post-render methods
  win.zE.identify = identify;
  win.zE.activate = activate;
  win.zE.hide = hide;

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

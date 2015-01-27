module React from 'react';

import { beacon }             from 'service/beacon';
import { logging }            from 'service/logging';
import { renderer }           from 'service/renderer';
import { transport }          from 'service/transport';
import { cacheBuster }        from 'service/cacheBuster';
import { i18n }               from 'service/i18n';
import { win, location,
         document as doc }    from 'utility/globals';
import { mediator }           from 'service/mediator';
import { getDeviceZoom,
         getSizingRatio,
         isMobileBrowser,
         isBlacklisted }      from 'utility/devices';
import { clickBusterHandler } from 'utility/utils';

require('imports?_=lodash!lodash');

function boot() {
  var publicApi,
      devApi,
      host = location.host,
      path = location.pathname,
      postRenderQueue = [],
      chatPages = [
        '/zopim',
        '/product/pricing',
        '/product/tour'
      ],
      handleQueue = function(queue) {
        _.forEach(queue, function(method) {
          if (method[0].locale) {
            // Backwards compat with zE({locale: 'zh-CN'}) calls
            i18n.setLocale(method[0].locale);
          } else {
            method[0]();
          }
        });
      },
      handlePostRenderQueue = function(postRenderQueue) {
        _.forEach(postRenderQueue, function(method) {
            win.zE[method[0]](...method[1]);
        });
      },
      identify = function(user) {
        mediator.channel.broadcast('.identify', user);
      },
      activate = function() {
        mediator.channel.broadcast('.activate');
      },
      hide = function() {
        mediator.channel.broadcast('.hide');
      },
      show = function() {
        mediator.channel.broadcast('.show');
      },
      postRenderQueueCallback = function(...args) {
        // "this" is bound to the method name
        postRenderQueue.push([this, args]);
      };

      // Firefox has an issue with calculating computed styles from within a iframe
      // with display:none. If getComputedStyle returns null we adjust the styles on
      // the iframe so when we need to query the parent document it will work.
      // http://bugzil.la/548397
      if (getComputedStyle(doc.documentElement) === null) {
        let iframe = window.frameElement,
            newStyle = 'width: 0; height: 0; border: 0; position: absolute; top: -9999px';

        iframe.removeAttribute('style');
        iframe.setAttribute('style', newStyle);
      }

  React.initializeTouchEvents(true);

  logging.init();

  cacheBuster.bustCache(__EMBEDDABLE_VERSION__);
  transport.init({ zendeskHost: document.zendeskHost });

  beacon.init(__EMBEDDABLE_VERSION__).send();

  publicApi = {
    version:   __EMBEDDABLE_VERSION__,
    setLocale: i18n.setLocale,
    hide:      renderer.hide,
    show:      postRenderQueueCallback.bind('show'),
    identify:  postRenderQueueCallback.bind('identify'),
    activate:  postRenderQueueCallback.bind('activate')
  };

  if (__DEV__) {
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

  _.extend(win.zEmbed, publicApi, devApi);

  handleQueue(document.zEQueue);

  // Post-render methods
  win.zE.identify = identify;
  win.zE.activate = activate;
  win.zE.hide = hide;
  win.zE.show = show;

  if (!isBlacklisted()) {
    //The config for zendesk.com
    if (host === 'www.zendesk.com') {
      if (_.contains(chatPages, path)) {
        renderer.init(renderer.hardcodedConfigs.zendeskWithChat);
      } else {
        renderer.init(renderer.hardcodedConfigs.zendeskDefault);
      }
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
    let isPinching,
        propagateFontRatioChange = (isPinching) => {
          setTimeout(() => {
            renderer.hideByZoom((getDeviceZoom() > 2) || (Math.abs(win.orientation) === 90));
            mediator.channel.broadcast('.updateZoom', getSizingRatio(isPinching));
          }, 0);
        };

    var zoomMonitor = (() => {
      var interval = null,
          iterations = 0,
          oldZoom,
          oldOffset = [0, 0],
          currentZoom = getDeviceZoom,
          currentOffset = () => {
            return [win.pageXOffset, win.pageYOffset];
          },
          zoomEqual = (a, b) => {
            return Math.abs(a - b) < 0.001;
          },
          offsetEqual = (a, b) => {
            return (a[0] === b[0]) && (a[1] === b[1]);
          },
          startMonitor = () => {
            if (interval !== null) {
              clearInterval(interval);
            }

            iterations = 0;
            interval = setInterval(() => {
              if (iterations > 10000 || zoomEqual(oldZoom, currentZoom()) &&
                  offsetEqual(oldOffset, currentOffset())) {
                clearInterval(interval);
                interval = null;
                // show
                propagateFontRatioChange(true);
              } else {
                oldZoom = currentZoom();
                oldOffset = currentOffset();
                iterations++;
              }
            }, 300);
          };

      return _.debounce(startMonitor, 10);
    })();

    var lastTouchEnd = 0;

    win.addEventListener('touchstart', Airbrake.wrap((e) => {
      if (e.touches.length === 2) {
        renderer.hideByZoom(true);
      }
      zoomMonitor();
    }));

    win.addEventListener('touchmove', Airbrake.wrap((e) => {
      // Touch end won't tell you if multiple touches are detected
      // so we store the touches length on move and check on end
      isPinching = e.touches.length > 1;

      if (e.touches.length === 2) {
        renderer.hideByZoom(true);
      }
      zoomMonitor();
    }));

    win.addEventListener('touchend', Airbrake.wrap(() => {
      var now = Date.now();

      if ((now - lastTouchEnd) < 250) {
        renderer.hideByZoom(true);

      }

      lastTouchEnd = now;
      zoomMonitor();
    }));

    // Recalc ratio when user focus on field
    // delay by 500ms so browser zoom is done
    doc.addEventListener('focus', () => {
      setTimeout(() => propagateFontRatioChange(true), 500);
    }, true);

    win.addEventListener('orientationchange', () => {
      propagateFontRatioChange();
    });

    win.addEventListener('click', clickBusterHandler, true);

    propagateFontRatioChange();
  }
}

if (!cacheBuster.isCacheBusting(window.name)) {
  try {
    boot();
  } catch (err) {
    logging.error({
      error: err
    });
  }
}

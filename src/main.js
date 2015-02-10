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
import { isMobileBrowser,
         isBlacklisted }      from 'utility/devices';
import { clickBusterHandler } from 'utility/utils';
import { initMobileScaling }  from 'utility/mobileScaling';

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
      activate = function(options) {
        mediator.channel.broadcast('.activate', options);
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

  // To enable $zopim api calls to work we need to define the queue callback.
  // When we inject the snippet we remove the queue method and just inject
  // the script tag.
  if (!win.$zopim) {
    let $zopim = win.$zopim = function(callback) {
      $zopim._.push(callback);
    };
    $zopim.set = function(callback) {
      $zopim.set._.push(callback);
    };
    $zopim._ = [];
    $zopim.set._ = [];
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
      let configLoadStart = Date.now();
      transport.get({
        method: 'get',
        path: '/embeddable/config',
        callbacks: {
          done(res) {
            beacon.sendConfigLoadTime(Date.now() - configLoadStart);
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
    initMobileScaling();

    win.addEventListener('click', clickBusterHandler, true);
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

// Addresses react namespace conflict described here:
// https://github.com/facebook/react/issues/1939#issuecomment-100786151
require('utility/utils').patchReactIdAttribute();

import _ from 'lodash';

import { authentication } from 'service/authentication';
import { beacon } from 'service/beacon';
import { cacheBuster } from 'service/cacheBuster';
import { i18n } from 'service/i18n';
import { logging } from 'service/logging';
import { mediator } from 'service/mediator';
import { renderer } from 'service/renderer';
import { transport } from 'service/transport';
import { isMobileBrowser,
         isBlacklisted } from 'utility/devices';
import { win, location,
         document as doc } from 'utility/globals';
import { initMobileScaling } from 'utility/mobileScaling';
import { clickBusterHandler } from 'utility/utils';

function boot() {
  let devApi;
  let postRenderQueue = [];
  const host = location.host;
  const path = location.pathname;
  const chatPages = [
    '/zopim',
    '/product/pricing',
    '/product/tour'
  ];
  const handleQueue = function(queue) {
    _.forEach(queue, function(method) {
      if (method[0].locale) {
        // Backwards compat with zE({locale: 'zh-CN'}) calls
        i18n.setLocale(method[0].locale);
      } else {
        try {
          method[0]();
        } catch (e) {
          const err = new Error([
            'An error occurred in your use of the Zendesk Widget API:',
            method[0],
            'Check out the Developer API docs to make sure you\'re using it correctly',
            'https://developer.zendesk.com/embeddables/docs/widget/api',
            e.stack
          ].join('\n\n'));

          err.special = true;

          throw err;
        }
      }
    });
  };
  const handlePostRenderQueue = function(postRenderQueue) {
    _.forEach(postRenderQueue, function(method) {
      win.zE[method[0]](...method[1]);
    });
  };
  const identify = function(user) {
    mediator.channel.broadcast('.onIdentify', user);
  };
  const handleSettings = function(params) {
    if (params.authenticate) {
      authentication.authenticate(params.authenticate);
    }
  };
  const logout = function() {
    mediator.channel.broadcast('.logout');
  };
  const setHelpCenterSuggestions = function(options) {
    mediator.channel.broadcast('.onSetHelpCenterSuggestions', options);
  };
  const activate = function(options) {
    mediator.channel.broadcast('.activate', options);
  };
  const activateNps = function(options) {
    mediator.channel.broadcast('nps.onActivate', options);
  };
  const activateIpm = function(options) {
    mediator.channel.broadcast('ipm.onActivate', options);
  };
  const hide = function() {
    mediator.channel.broadcast('.hide');
  };
  const show = function() {
    mediator.channel.broadcast('.show');
  };
  const postRenderQueueCallback = function(...args) {
    // "this" is bound to the method name
    postRenderQueue.push([this, args]);
  };

  // Firefox has an issue with calculating computed styles from within a iframe
  // with display:none. If getComputedStyle returns null we adjust the styles on
  // the iframe so when we need to query the parent document it will work.
  // http://bugzil.la/548397
  if (getComputedStyle(doc.documentElement) === null) {
    const iframe = window.frameElement;
    const newStyle = 'width: 0; height: 0; border: 0; position: absolute; top: -9999px';

    iframe.removeAttribute('style');
    iframe.setAttribute('style', newStyle);
  }

  logging.init();

  cacheBuster.bustCache(__EMBEDDABLE_VERSION__);

  transport.init({
    zendeskHost: document.zendeskHost,
    version: __EMBEDDABLE_VERSION__
  });

  beacon.init().send();
  authentication.init();

  const publicApi = {
    version: __EMBEDDABLE_VERSION__,
    setLocale: i18n.setLocale,
    hide: renderer.hide,
    show: postRenderQueueCallback.bind('show'),
    setHelpCenterSuggestions: postRenderQueueCallback.bind('setHelpCenterSuggestions'),
    identify: postRenderQueueCallback.bind('identify'),
    logout: postRenderQueueCallback.bind('logout'),
    activate: postRenderQueueCallback.bind('activate'),
    activateNps: postRenderQueueCallback.bind('activateNps'),
    activateIpm: postRenderQueueCallback.bind('activateIpm')
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

  if (win.zESettings) {
    handleSettings(win.zESettings);
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

    // Make this the first in the queue so that subsequent
    // user-initiated setTitle(…) calls will override this value
    $zopim(function() {
      win.$zopim.livechat.window.setTitle(i18n.t('embeddable_framework.chat.title'));
    });
  }

  _.extend(win.zEmbed, publicApi, devApi);

  handleQueue(document.zEQueue);

  // Post-render methods
  win.zE.setHelpCenterSuggestions = setHelpCenterSuggestions;
  win.zE.identify = identify;
  win.zE.logout = logout;
  win.zE.activate = activate;
  win.zE.activateNps = activateNps;
  win.zE.activateIpm = activateIpm;
  win.zE.hide = hide;
  win.zE.show = show;

  // The config for zendesk.com
  if (host === 'www.zendesk.com') {
    if (_.contains(chatPages, path)) {
      renderer.init(renderer.hardcodedConfigs.zendeskWithChat);
    } else {
      renderer.init(renderer.hardcodedConfigs.zendeskDefault);
    }
    handlePostRenderQueue(postRenderQueue);
  } else {
    const configLoadStart = Date.now();

    transport.get({
      method: 'get',
      path: '/embeddable/config',
      callbacks: {
        done(res) {
          // only send 1/10 times
          if (Math.random() <= 0.1) {
            beacon.sendConfigLoadTime(Date.now() - configLoadStart);
          }

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

  if (isMobileBrowser()) {
    initMobileScaling();

    win.addEventListener('click', clickBusterHandler, true);
  }
}

if (!cacheBuster.isCacheBusting(window.name)) {
  try {
    if (!isBlacklisted()) {
      // setTimeout needed for ie10. Otherwise it calls boot too early
      // and the other zE functions on the page aren't seen. This leads to
      // the pre render queue being skipped which breaks zE.hide.
      setTimeout(boot, 0);
    }
  } catch (err) {
    logging.error({
      error: err
    });
  }
}

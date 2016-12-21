// Addresses react namespace conflict described here:
// https://github.com/facebook/react/issues/1939#issuecomment-100786151
require('utility/utils').patchReactIdAttribute();

import _ from 'lodash';

import { authentication } from 'service/authentication';
import { beacon } from 'service/beacon';
import { cacheBuster } from 'service/cacheBuster';
import { i18n } from 'service/i18n';
import { identity } from 'service/identity';
import { logging } from 'service/logging';
import { mediator } from 'service/mediator';
import { renderer } from 'service/renderer';
import { settings } from 'service/settings';
import { transport } from 'service/transport';
import { appendMetaTag,
         clickBusterHandler,
         getMetaTagsByName,
         isBlacklisted,
         isMobileBrowser } from 'utility/devices';
import { win,
         document as doc } from 'utility/globals';
import { initMobileScaling } from 'utility/mobileScaling';

const setReferrerMetas = (iframe) => {
  const metaElements = getMetaTagsByName(doc, 'referrer');
  const referrerMetas = _.map(metaElements, (meta) => meta.content);
  const iframeDoc = iframe.contentDocument;

  _.forEach(referrerMetas, (content) => appendMetaTag(iframeDoc, 'referrer', content));
};

function boot() {
  let devApi;
  let postRenderQueue = [];
  let $zopim = _.noop;
  const handleQueue = (queue) => {
    _.forEach(queue, (method) => {
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
  const handlePostRenderQueue = (postRenderQueue) => {
    _.forEach(postRenderQueue, (method) => {
      win.zE[method[0]](...method[1]);
    });

    renderer.postRenderCallbacks();
  };
  const identify = (user) => {
    mediator.channel.broadcast('.onIdentify', user);
  };
  const logout = () => {
    mediator.channel.broadcast('.logout');
  };
  const setHelpCenterSuggestions = (options) => {
    mediator.channel.broadcast('.onSetHelpCenterSuggestions', options);
  };
  const activate = (options) => {
    mediator.channel.broadcast('.activate', options);
  };
  const activateNps = (options) => {
    mediator.channel.broadcast('nps.onActivate', options);
  };
  const activateIpm = (options) => {
    mediator.channel.broadcast('ipm.onActivate', options);
  };
  const hide = () => {
    mediator.channel.broadcast('.hide');
  };
  const show = () => {
    mediator.channel.broadcast('.show');
  };
  const setLocale = (locale) => {
    i18n.setLocale(locale, true);
    mediator.channel.broadcast('.onSetLocale', locale);
  };
  // no "fat arrow" because it binds `this` to the scoped environment and does not allow it to be re-set with .bind()
  const postRenderQueueCallback = function(...args) {
    // "this" is bound to the method name
    postRenderQueue.push([this, args]);
  };

  const iframe = window.frameElement;

  // Firefox has an issue with calculating computed styles from within a iframe
  // with display:none. If getComputedStyle returns null we adjust the styles on
  // the iframe so when we need to query the parent document it will work.
  // http://bugzil.la/548397
  if (getComputedStyle(doc.documentElement) === null) {
    const newStyle = 'width: 0; height: 0; border: 0; position: absolute; top: -9999px';

    iframe.removeAttribute('style');
    iframe.setAttribute('style', newStyle);
  }

  // Honour any no-referrer policies on the host page by dynamically
  // injecting the appropriate meta tags on the iframe.
  // TODO: When main.js refactor is complete, test this.
  setReferrerMetas(iframe);

  identity.init();
  logging.init();

  cacheBuster.bustCache(__EMBEDDABLE_VERSION__);

  transport.init({
    zendeskHost: document.zendeskHost,
    version: __EMBEDDABLE_VERSION__
  });

  settings.init();
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
    win.zE = win.zEmbed = (callback) => {
      callback();
    };
  } else {
    win.zEmbed = (callback) => {
      callback();
    };
  }

  // To enable $zopim api calls to work we need to define the queue callback.
  // When we inject the snippet we remove the queue method and just inject
  // the script tag.
  if (!win.$zopim) {
    $zopim = win.$zopim = (callback) => {
      $zopim._.push(callback);
    };

    $zopim.set = (callback) => {
      $zopim.set._.push(callback);
    };
    $zopim._ = [];
    $zopim.set._ = [];
  }

  _.extend(win.zEmbed, publicApi, devApi);

  handleQueue(document.zEQueue);

  beacon.init();

  win.onunload = identity.unload;

  // Post-render methods
  win.zE.setHelpCenterSuggestions = setHelpCenterSuggestions;
  win.zE.setLocale = setLocale;
  win.zE.identify = identify;
  win.zE.logout = logout;
  win.zE.activate = activate;
  win.zE.activateNps = activateNps;
  win.zE.activateIpm = activateIpm;
  win.zE.hide = hide;
  win.zE.show = show;

  const configLoadStart = Date.now();

  transport.get({
    method: 'get',
    path: '/embeddable/config',
    callbacks: {
      done(res) {
        const config = res.body;

        beacon.setConfig(config);

        // Only send 1/10 times
        if (Math.random() <= 0.1) {
          beacon.sendConfigLoadTime(Date.now() - configLoadStart);
        }

        beacon.sendPageView();
        if (win.zESettings) {
          beacon.trackSettings(settings.getTrackSettings());
        }

        renderer.init(config);
        handlePostRenderQueue(postRenderQueue);
      },
      fail(error) {
        if (error.status !== 404) {
          logging.error({
            error: error,
            context: {
              account: document.zendeskHost
            }
          });
        }
      }
    }
  });

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

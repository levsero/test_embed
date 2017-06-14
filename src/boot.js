import _ from 'lodash';

import { authentication } from 'service/authentication';
import { beacon } from 'service/beacon';
import { i18n } from 'service/i18n';
import { identity } from 'service/identity';
import { logging } from 'service/logging';
import { mediator } from 'service/mediator';
import { store } from 'service/persistence';
import { renderer } from 'service/renderer';
import { settings } from 'service/settings';
import { transport } from 'service/transport';
import { appendMetaTag,
         clickBusterHandler,
         getMetaTagsByName,
         isMobileBrowser } from 'utility/devices';
import { initMobileScaling } from 'utility/mobileScaling';

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

const handlePostRenderQueue = (win, postRenderQueue) => {
  _.forEach(postRenderQueue, (method) => {
    win.zE[method[0]](...method[1]);
  });

  renderer.postRenderCallbacks();
};

const setReferrerMetas = (iframe, doc) => {
  const metaElements = getMetaTagsByName(doc, 'referrer');
  const referrerMetas = _.map(metaElements, (meta) => meta.content);
  const iframeDoc = iframe.contentDocument;

  _.forEach(referrerMetas, (content) => appendMetaTag(iframeDoc, 'referrer', content));

  if (referrerMetas.length > 0) {
    store.set('referrerPolicy', _.last(referrerMetas), 'session');
  } else {
    store.remove('referrerPolicy', 'session');
  }
};

const setupIframe = (iframe, doc) => {
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
  if (iframe) {
    boot.setReferrerMetas(iframe, doc);
  }
};

const setupServices = () => {
  identity.init();

  transport.init({
    zendeskHost: document.zendeskHost,
    version: __EMBEDDABLE_VERSION__
  });

  settings.init();
  authentication.init();
};

const setupWidgetQueue = (win, postRenderQueue) => {
  let devApi;

  // no "fat arrow" because it binds `this` to the scoped environment and does not allow it to be re-set with .bind()
  const postRenderQueueCallback = function(...args) {
    // "this" is bound to the method name
    postRenderQueue.push([this, args]);
  };
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
      devRender: renderer.init
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

  return {
    publicApi,
    devApi
  };
};

const setupZopimQueue = (win) => {
  let $zopim = () => {};

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
};

const getConfig = (win, postRenderQueue) => {
  const configLoadStart = Date.now();
  const done = (res) => {
    const config = res.body;

    // Remove this code once Rollbar is GA'd
    logging.init(config.useRollbar);

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
    boot.handlePostRenderQueue(win, postRenderQueue);
  };
  const fail = (error) => {
    if (error.status !== 404) {
      logging.error({
        error: error,
        context: {
          account: document.zendeskHost
        }
      });
    }
  };

  transport.get({
    method: 'get',
    path: '/embeddable/config',
    callbacks: {
      done,
      fail
    }
  }, false);
};

const setupWidgetApi = (win) => {
  win.zE.identify = (user) => {
    mediator.channel.broadcast('.onIdentify', user);
  };
  win.zE.logout = () => {
    mediator.channel.broadcast('.logout');
  };
  win.zE.setHelpCenterSuggestions = (options) => {
    mediator.channel.broadcast('.onSetHelpCenterSuggestions', options);
  };
  win.zE.activate = (options) => {
    mediator.channel.broadcast('.activate', options);
  };
  win.zE.activateNps = (options) => {
    mediator.channel.broadcast('nps.onActivate', options);
  };
  win.zE.activateIpm = (options) => {
    mediator.channel.broadcast('ipm.onActivate', options);
  };
  win.zE.hide = () => {
    mediator.channel.broadcast('.hide');
  };
  win.zE.show = () => {
    mediator.channel.broadcast('.show');
  };
  win.zE.setLocale = (locale) => {
    i18n.setLocale(locale, true);
    mediator.channel.broadcast('.onSetLocale', locale);
  };
};

const start = (win, doc) => {
  boot.setupIframe(window.frameElement, doc);
  boot.setupServices();

  const postRenderQueue = [];
  const { publicApi, devApi } = boot.setupWidgetQueue(win, postRenderQueue);

  boot.setupZopimQueue(win);

  _.extend(win.zEmbed, publicApi, devApi);

  boot.handleQueue(document.zEQueue);

  beacon.init();
  win.onunload = identity.unload;

  boot.setupWidgetApi(win);
  boot.getConfig(win, postRenderQueue);

  if (isMobileBrowser()) {
    initMobileScaling();

    win.addEventListener('click', clickBusterHandler, true);
  }
};

export const boot = {
  start,

  // Exported for testing only.
  handleQueue,
  handlePostRenderQueue,
  setReferrerMetas,
  setupIframe,
  setupServices,
  setupWidgetQueue,
  setupZopimQueue,
  setupWidgetApi,
  getConfig
};

import _ from 'lodash';

import { beacon } from 'service/beacon';
import { identity } from 'service/identity';
import { logging } from 'service/logging';
import { store } from 'service/persistence';
import { renderer } from 'service/renderer';
import { webWidgetApi } from 'service/api/webWidgetApi';
import { zopimApi } from 'service/api/zopimApi';
import { settings } from 'service/settings';
import { http } from 'service/transport';
import { GA } from 'service/analytics/googleAnalytics';
import { appendMetaTag,
  clickBusterHandler,
  getMetaTagsByName,
  isMobileBrowser } from 'utility/devices';
import { initMobileScaling } from 'utility/mobileScaling';
import { updateEmbeddableConfig } from 'src/redux/modules/base';
import { initResizeMonitor } from 'utility/window';
import { i18n } from 'service/i18n';
import createStore from 'src/redux/createStore';
import tracker from 'service/logging/tracker';

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

const getZendeskHost = () => {
  const path = 'web_widget.id';

  return document.zendeskHost || _.get(document.zendesk, path) || _.get(document, path);
};

const setupServices = (reduxStore) => {
  identity.init();

  http.init({
    zendeskHost: getZendeskHost(),
    version: __EMBEDDABLE_VERSION__
  });

  settings.init(reduxStore);
  logging.init(settings.getErrorReportingEnabled());
  GA.init();
};

const displayOssAttribution = () => {
  const message = 'Our embeddable contains third-party, open source software and/or libraries. ' +
                  'To view them and their license terms, go to http://goto.zendesk.com/embeddable-legal-notices';

  console.info(message); // eslint-disable-line no-console
};

const filterEmbeds = (config) => {
  const features = _.get(document.zendesk, 'web_widget.features');

  // If there are no features available to read, do not do filtering
  if (!features) return config;
  // If talk feature isn't available, act as if talk isn't in the config
  if (!_.includes(features, 'talk') && _.has(config.embeds, 'talk')) delete config.embeds.talk;
  // If chat feature isn't available and new chat is requested, act as if chat isn't in the config
  if (!_.includes(features, 'chat') && config.newChat && _.has(config.embeds, 'zopimChat')) {
    delete config.embeds.zopimChat;
  }

  return config;
};

const getConfig = (win, postRenderQueue, reduxStore) => {
  if (win.zESkipWebWidget) return;

  const configLoadStart = Date.now();
  const done = (res) => {
    const config = filterEmbeds(res.body);

    if (config.hostMapping) {
      http.updateConfig({ hostMapping: config.hostMapping });
    }

    if (config.track) {
      tracker.send = true;
      tracker.flush();
    }

    reduxStore.dispatch(updateEmbeddableConfig(res.body));

    beacon.setConfig(config);

    if (config.ipmAllowed) {
      webWidgetApi.setupIPMApi(win, reduxStore, config);
    }

    // Only send 1/10 times
    if (Math.random() <= 0.1) {
      beacon.sendConfigLoadTime(Date.now() - configLoadStart);
    }

    beacon.sendPageView();

    if (win.zESettings) {
      beacon.trackSettings(settings.getTrackSettings());
    }

    if (config.newChat) {
      zopimApi.setUpZopimApiMethods(win, reduxStore);
    }

    renderer.init(config, reduxStore);
    webWidgetApi.handlePostRenderQueue(win, postRenderQueue, reduxStore);
  };
  const fail = (error) => {
    if (error.status !== 404) {
      logging.error({
        error: error,
        context: {
          account: getZendeskHost()
        }
      });
    }
  };

  http.get({
    method: 'get',
    path: '/embeddable/config',
    callbacks: {
      done,
      fail
    }
  }, false);
};

const start = (win, doc) => {
  const reduxStore = createStore();
  const postRenderQueue = [];
  const { publicApi, devApi } = webWidgetApi.setupWidgetQueue(win, postRenderQueue, reduxStore);

  i18n.init(reduxStore);
  boot.setupIframe(window.frameElement, doc);
  boot.setupServices(reduxStore);
  zopimApi.setupZopimQueue(win);

  _.extend(win.zEmbed, publicApi, devApi);

  webWidgetApi.handleQueue(reduxStore, document.zEQueue);

  beacon.init();
  win.onunload = identity.unload;

  webWidgetApi.setupWidgetApi(win, reduxStore);

  boot.getConfig(win, postRenderQueue, reduxStore, devApi);

  displayOssAttribution();

  if (isMobileBrowser()) {
    initMobileScaling();

    win.addEventListener('click', clickBusterHandler, true);
  } else {
    initResizeMonitor(win);
  }
};

export const boot = {
  start,

  // Exported for testing only.
  setReferrerMetas,
  setupIframe,
  setupServices,
  getConfig
};

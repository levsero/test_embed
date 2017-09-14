import _ from 'lodash';

import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { store } from 'service/persistence';
import { transport } from 'service/transport';
import { win,
         document as doc,
         navigator } from 'utility/globals';
import { isOnHelpCenterPage } from 'utility/pages';
import { nowInSeconds,
         parseUrl,
         referrerPolicyUrl,
         sha1 } from 'utility/utils';

let config = {
  method: 'GET',
  endpoint: '/embeddable_blip',
  identifyEndpoint: '/embeddable_identify',
  reduceBlipping: false,
  newIdentify: false
};

const sendPageViewWhenReady = () => {
  // We need to invoke `sendPageView` on `DOMContentLoaded` because
  // for help center host pages, the script that defines the `HelpCenter`
  // global object may not be executed yet.
  // DOMContentLoaded: https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
  if (doc.readyState !== 'complete' &&
      doc.readyState !== 'interactive') {
    doc.addEventListener('DOMContentLoaded', () => {
      sendPageView();
    }, false);
  } else {
    sendPageView();
  }
};

const sendPageView = () => {
  if (config.reduceBlipping) return;

  const now = Date.now();
  const referrer = parseUrl(doc.referrer);
  const previousTime = store.get('currentTime', 'session') || 0;
  const url = win.location.origin;
  const timeOnLastPage = () => {
    return referrer.origin === url && previousTime ? (now - previousTime) : 0;
  };
  const referrerPolicy = store.get('referrerPolicy', 'session');
  const referrerUrl = referrerPolicy ? referrerPolicyUrl(referrerPolicy, referrer.href) : referrer.href;
  const pageViewParams = referrerUrl ? { referrer: referrerUrl } : {};
  const pageView = {
    time: timeOnLastPage(),
    loadTime: getFrameworkLoadTime(),
    navigatorLanguage: navigator.language,
    pageTitle: doc.title,
    userAgent: navigator.userAgent,
    helpCenterDedup: isOnHelpCenterPage()
  };
  const payload = {
    type: 'pageView',
    method: config.method,
    path: config.endpoint,
    params: {
      pageView: _.extend(pageViewParams, pageView)
    }
  };

  transport.sendWithMeta(payload);
};

function setConfig(_config) {
  _.merge(config, {
    reduceBlipping: !!_config.reduceBlipping,
    newIdentify: !!_config.newIdentify
  });
}

function init() {
  const now = Date.now();

  store.set('currentTime', now, 'session');

  mediator.channel.subscribe('beacon.identify', identify);
  mediator.channel.subscribe('beacon.trackUserAction', trackUserAction);
}

function sendConfigLoadTime(time) {
  if (config.reduceBlipping) return;

  const params = {
    performance: { configLoadTime: time }
  };
  const payload = {
    type: 'performance',
    method: config.method,
    path: config.endpoint,
    params: params
  };

  transport.sendWithMeta(payload);
}

function trackUserAction(category, action, label = null, value = null) {
  if (_.isUndefined(category) || _.isUndefined(action) || config.reduceBlipping) {
    return false;
  }

  const userAction = {
    category: category,
    action: action,
    label: label,
    value: value
  };
  const payload = {
    type: 'userAction',
    method: config.method,
    path: config.endpoint,
    params: { userAction }
  };

  transport.sendWithMeta(payload);
}

function trackSettings(settings) {
  if (!win.zESettings || _.isEmpty(settings) || config.reduceBlipping) return;

  const previousSettings = store.get('settings');
  const expiryTime = nowInSeconds() - 24*60*60;
  const encoded = sha1(JSON.stringify(settings));
  const validSettings = _.filter(previousSettings, (settings) => settings[1] > expiryTime);
  const done = () => {
    validSettings.push([encoded, nowInSeconds()]);
    store.set('settings', validSettings);
  };

  const payload = {
    type: 'settings',
    method: config.method,
    path: config.endpoint,
    params: { settings },
    callbacks: { done }
  };

  if (!_.find(validSettings, (s) => s[0] === encoded)) {
    transport.sendWithMeta(payload);
  } else {
    // Clear any expired settings that exist from other pages
    // on the customers domain.
    store.set('settings', validSettings);
  }
}

function identify(user) {
  const { newIdentify, method, identifyEndpoint } = config;
  const payload = {
    type: 'user',
    method: newIdentify ? method : 'POST',
    path: newIdentify ? identifyEndpoint : '/embeddable/identify',
    params:  {
      user: { ...user, localeId: i18n.getLocaleId() },
      userAgent: navigator.userAgent
    }
  };

  transport.sendWithMeta(payload, newIdentify);
}

function getFrameworkLoadTime() {
  let entry;
  const now = Date.now();
  let loadTime = document.t ? now - document.t : undefined;

  // https://bugzilla.mozilla.org/show_bug.cgi?id=1045096
  try {
    if ('performance' in window && 'getEntries' in window.performance) {
      entry = _.find(window.performance.getEntries(), function(entry) {
        return entry.name.indexOf('main.js') !== -1;
      });

      if (entry && entry.duration) {
        loadTime = entry.duration;
      }
    }
  } catch (e) {}

  return loadTime >= 0 ? loadTime : undefined;
}

export const beacon = {
  init: init,
  trackUserAction: trackUserAction,
  trackSettings: trackSettings,
  identify: identify,
  sendConfigLoadTime: sendConfigLoadTime,
  getFrameworkLoadTime: getFrameworkLoadTime,
  sendPageView: sendPageViewWhenReady,
  setConfig: setConfig
};

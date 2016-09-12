import _ from 'lodash';

import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { store } from 'service/persistence';
import { transport } from 'service/transport';
import { win,
         document as doc,
         navigator } from 'utility/globals';
import { isOnHelpCenterPage } from 'utility/pages';
import { parseUrl } from 'utility/utils';

const sendPageView = () => {
  const now = Date.now();
  const referrer = parseUrl(doc.referrer);
  const previousTime = store.get('currentTime', true) || 0;
  const url = win.location.origin;
  const timeOnLastPage = () => {
    return referrer.origin === url && previousTime ? (now - previousTime) : 0;
  };
  const params = {
    pageView: {
      referrer: referrer.href,
      time: timeOnLastPage(),
      loadTime: getFrameworkLoadTime(),
      navigatorLanguage: navigator.language,
      pageTitle: doc.title,
      userAgent: navigator.userAgent,
      helpCenterDedup: isOnHelpCenterPage()
    }
  };
  const payload = {
    method: 'POST',
    path: '/embeddable/blips',
    params: params
  };

  transport.sendWithMeta(payload);
};

function init() {
  const now = Date.now();

  store.set('currentTime', now, true);

  mediator.channel.subscribe('beacon.identify', identify);
  mediator.channel.subscribe('beacon.trackUserAction', trackUserAction);

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
}

function sendConfigLoadTime(time) {
  const params = {
    performance: { configLoadTime: time }
  };
  const payload = {
    method: 'POST',
    path: '/embeddable/blips',
    params: params
  };

  transport.sendWithMeta(payload);
}

function trackUserAction(category, action, label = null, value = null) {
  if (_.isUndefined(category) || _.isUndefined(action)) {
    return false;
  }

  const userAction = {
    category: category,
    action: action,
    label: label,
    value: value
  };
  const payload = {
    method: 'POST',
    path: '/embeddable/blips',
    params: { userAction }
  };

  transport.sendWithMeta(payload);
}

function trackSettings(settings) {
  if (!win.zESettings) return;

  const payload = {
    method: 'POST',
    path: '/embeddable/blips',
    params: { settings }
  };

  transport.sendWithMeta(payload);
}

function identify(user) {
  user.localeId = i18n.getLocaleId();
  const payload = {
    method: 'POST',
    path: '/embeddable/identify',
    params:  {
      user: user,
      userAgent: navigator.userAgent
    },
    callbacks: {
      done: (res) => {
        mediator.channel.broadcast('identify.onSuccess', res.body);
      }
    }
  };

  transport.sendWithMeta(payload);
}

function getFrameworkLoadTime() {
  let entry;
  const now = Date.now();
  let loadTime = document.t ? now - document.t : undefined;
  debugger

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
  getFrameworkLoadTime: getFrameworkLoadTime
};

import _ from 'lodash';

import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { store } from 'service/persistence';
import { transport } from 'service/transport';
import { win,
         document as doc,
         navigator } from 'utility/globals';
import { parseUrl,
         getFrameworkLoadTime } from 'utility/utils';

let pageViewBlipAlreadySent = false;

function init(isUsingIdentify) {
  const now = Date.now();

  store.set('currentTime', now, true);

  mediator.channel.subscribe('beacon.identify', identify);

  if (!isUsingIdentify) {
    sendPageView();
  }
}

function sendPageView(user) {
  if (pageViewBlipAlreadySent) {
    return;
  } else {
    pageViewBlipAlreadySent = true;
  }

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
      userAgent: navigator.userAgent
    }
  };
  const payload = {
    method: 'POST',
    path: '/embeddable/blips',
    params: params
  };

  if (user && user.email) {
    _.extend(params.pageView, { email: user.email });
  }

  transport.sendWithMeta(payload);
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

function trackUserAction(category, action, label, value) {
  if (_.isUndefined(action) || _.isUndefined(category)) {
    return false;
  }

  const params = {
    userAction: {
      category: category,
      action: action,
      label: label,
      value: value
    }
  };
  const payload = {
    method: 'POST',
    path: '/embeddable/blips',
    params: params
  };

  transport.sendWithMeta(payload);
}

function identify(user) {
  user.localeId = i18n.getLocaleId();
  const payload = {
    method: 'POST',
    path: '/embeddable/identify',
    params:  { user: user },
    callbacks: {
      done: (res) => {
        mediator.channel.broadcast('identify.onSuccess', res.body);
        sendPageView(user);
      },
      fail: () => sendPageView() // send pageview blip even on failure
    }
  };

  // store email address in SessionStorage to use for page view blips
  store.set('identifyEmail', user.email, true);
  transport.sendWithMeta(payload);
}

export const beacon = {
  init: init,
  sendPageView: sendPageView,
  trackUserAction: trackUserAction,
  identify: identify,
  sendConfigLoadTime: sendConfigLoadTime
};

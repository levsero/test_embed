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

let pageViewSent = false;

function init(delaySendPageView) {
  const now = Date.now();

  store.set('currentTime', now, true);

  mediator.channel.subscribe('beacon.identify', identify);
  mediator.channel.subscribe('beacon.trackUserAction', trackUserAction);

  if (!delaySendPageView) {
    sendPageView();
  }
}

function sendPageView() {
  if (pageViewSent) return;

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
  const userEmail = store.get('identifyEmail', true);

  if (userEmail) {
    _.extend(params.pageView, { email: userEmail });
  }

  transport.sendWithMeta(payload);
  pageViewSent = true;
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

function trackUserAction(params = {}) {
  if (_.isUndefined(params.action) || _.isUndefined(params.category)) {
    return false;
  }

  const validParams = ['action', 'category', 'name', 'value', 'label'];
  const userAction = _.pick(params, validParams);
  const payload = {
    method: 'POST',
    path: '/embeddable/blips',
    params: { userAction }
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
        sendPageView();
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

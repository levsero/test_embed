import _ from 'lodash';

import { win,
         document as doc,
         navigator }            from 'utility/globals';
import { transport }            from 'service/transport';
import { store }                from 'service/persistence';
import { i18n }                 from 'service/i18n';
import { parseUrl,
         getFrameworkLoadTime } from 'utility/utils';
import { mediator }             from 'service/mediator';

function init() {
  const now = Date.now();
  store.set('currentTime', now, true);

  mediator.channel.subscribe('beacon.identify', identify);

  return this;
}

function send() {
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

function track(category, action, label, value) {

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
      done: function(res) {
        mediator.channel.broadcast('identify.onSuccess', res.body);
      }
    }
  };

  transport.sendWithMeta(payload);
}

export var beacon = {
  init: init,
  send: send,
  track: track,
  identify: identify,
  sendConfigLoadTime: sendConfigLoadTime
};

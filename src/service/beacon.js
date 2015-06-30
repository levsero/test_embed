import _ from 'lodash';

import { win,
         document as doc,
         navigator }            from 'utility/globals';
import { transport }            from 'service/transport';
import { identity }             from 'service/identity';
import { store }                from 'service/persistence';
import { i18n }                 from 'service/i18n';
import { parseUrl,
         getFrameworkLoadTime }  from 'utility/utils';

var version;

function init(_version = '') {
  var now = Date.now();
  store.set('currentTime', now, true);
  version = _version;
  return this;
}

function commonParams() {
  return {
    url: win.location.href,
    buid: identity.getBuid(),
    version: version,
    timestamp: (new Date()).toISOString()
  };
}

function send() {
  var now = Date.now(),
      referrer = parseUrl(doc.referrer),
      previousTime = store.get('currentTime', true) || 0,
      url = win.location.origin,
      timeOnLastPage = function () {
        return referrer.origin === url && previousTime ? (now - previousTime) : 0;
      },
      params = {
        pageView: {
          referrer: referrer.href,
          time: timeOnLastPage(),
          loadTime: getFrameworkLoadTime(),
          navigatorLanguage: navigator.language,
          pageTitle: doc.title,
          userAgent: navigator.userAgent
        }
      },
      payload = {
        method: 'POST',
        path: '/embeddable/blips',
        params: _.extend(commonParams(), params)
      };

  transport.send(payload);
}

function sendConfigLoadTime(time) {
  var payload = {
        method: 'POST',
        path: '/embeddable/blips',
        params: _.extend(commonParams(), {performance: {configLoadTime: time}})
  };
  transport.send(payload);
}

function track(category, action, label, value) {

  if (_.isUndefined(action) || _.isUndefined(category)) {
    return false;
  }

  var params = {
        userAction: {
          category: category,
          action: action,
          label: label,
          value: value
        }
      },
      payload = {
        method: 'POST',
        path: '/embeddable/blips',
        params: _.extend(commonParams(), params)
      };

  transport.send(payload);
}

function identify(user) {
  user.localeId = i18n.getLocaleId();
  var payload = {
    method: 'POST',
    path: '/embeddable/blips',
    params: _.extend(commonParams(), {user: user})
  };

  transport.send(payload);
}

export var beacon = {
  init: init,
  send: send,
  track: track,
  identify: identify,
  sendConfigLoadTime: sendConfigLoadTime
};

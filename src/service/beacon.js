import { win,
         document,
         navigator }            from 'utility/globals';
import { transport }            from 'service/transport';
import { identity }             from 'service/identity';
import { store }                from 'service/persistence';
import { parseUrl,
         getFrameworkTimings }  from 'utility/utils';

require('imports?_=lodash!lodash');

function init() {
  var now = Date.now();
  store.set('currentTime', now, true);
  return this;
}

function commonParams() {
  return {
    url: win.location.href,
    buid: identity.getBuid(),
    timestamp: (new Date()).toISOString()
  };
}

function send() {
  var now = Date.now(),
      referrer = parseUrl(document.referrer),
      previousTime = store.get('currentTime', true) || 0,
      url = win.location.origin,
      timeOnLastPage = function () {
        return referrer.origin === url && previousTime ? (now - previousTime) : 0;
      },
      params = {
        pageView: {
          referrer: referrer.href,
          time: timeOnLastPage(),
          loadTime: getFrameworkTimings().duration,
          navigatorLanguage: navigator.language,
          pageTitle: document.title,
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

export var beacon = {
  init: init,
  send: send,
  track: track
};

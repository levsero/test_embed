import { win,
         document,
         navigator } from 'util/globals';
import { transport } from 'service/transport';
import { identity  } from 'service/identity';
import { store     } from 'service/persistence';
import { parseUrl  } from 'util/utils';
require('imports?_=lodash!lodash');

function init() {
  var now = Date.now();
  store.set('currentTime', now, true);
  return this;
}

function commonParams() {
  return {
    'url': win.location.href,
    'buid': identity.getBuid(),
    'timestamp': (new Date()).toISOString(),
    'user_agent': navigator.userAgent
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
        'referrer': referrer.href,
        'time': timeOnLastPage(),
        'navigator_language': navigator.language,
        'page_title': document.title,
        'metrics': ['beacon']
      },
      payload = {
        method: 'POST',
        path: '/api/blips',
        params: _.extend(commonParams(), params),
        callbacks: {
          done: _.noop,
          fail: _.noop
        }
      };

  transport.send(payload);
}

function track(category, action, label, value) {

  if (_.isUndefined(action) || _.isUndefined(category)) {
    return false;
  }

  var params = {
        'userAction': {
          'category': category,
          'action': action,
          'label': label,
          'value': value
        }
      },
      payload = {
        method: 'POST',
        path: '/api/blips',
        params: _.extend(commonParams(), params),
        callbacks: {
          done: _.noop,
          fail: _.noop
        }
      };

  transport.send(payload);
}

export var beacon = {
  init: init,
  send: send,
  track: track
};

import { win,
         document,
         navigator } from 'util/globals';
import { transport } from 'service/transport';
import { identity  } from 'service/identity';
import { store     } from 'service/persistence';
import { parseUrl  } from 'util/utils';

function init() {
  var now = Date.now();
  store.set('currentTime', now, true);
  return this;
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
        'url': win.location.href,
        'buid': identity.getBuid(),
        'user_agent': navigator.userAgent,
        'referrer': referrer.href,
        'time': timeOnLastPage(),
        'metrics': ['beacon']
      };

  var payload = {
    method: 'POST',
    path: '/api/blips',
    params: params,
    callbacks: {
      done: function() {},
      fail: function() {}
    }
  };

  transport.send(payload);
}

export var beacon = {
  init: init,
  send: send
};

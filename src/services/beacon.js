import { win,
         document,
         navigator } from '../utils/globals';
import { transport } from '../transport';
import { identity  } from '../identity';
import { store     } from '../utils/persistence';
import { parseUrl  } from '../utils/utils';


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
        'useragent': navigator.userAgent,
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
  send: send
};

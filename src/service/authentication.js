import { mediator } from 'service/mediator';
import { store } from 'service/persistence';
import { transport } from 'service/transport';

function init() {
  mediator.channel.subscribe('authentication.authenticate', authenticate);
}

function authenticate(webToken) {
  const payload = {
    method: 'POST',
    path: '/embeddable/authenticate',
    params: webToken,
    callbacks: {
      done: function(res) {
        if (res.status === 200) {
          store.set(
            'zE_oauth',
            {
              'token': res.body.oauth_token,
              'expiry': res.body.oauth_expiry
            }
          );
        }
      }
    }
  };

  transport.send(payload);
}

function getToken() {
  const zeoauth = store.get('zE_oauth');

  if (isExpired(zeoauth)) {
    store.remove('zE_oauth');
    return null;
  }

  return zeoauth.token;
}

function isExpired(zeoauth) {
  const timeInterval = 1000 * 60 * 10; // 10 mins in ms

  if (zeoauth && zeoauth.expiry) {
    return Date.now() > zeoauth.expiry - timeInterval;
  } else {
    return false;
  }
}

export const authentication = {
  init: init,
  authenticate: authenticate,
  getToken: getToken
};

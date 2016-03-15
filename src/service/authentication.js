import { mediator } from 'service/mediator';
import { store } from 'service/persistence';
import { transport } from 'service/transport';

function init() {
  mediator.channel.subscribe('authentication.authenticate', authenticate);
}

function authenticate(webToken) {
  authenticateRequest('/embeddable/authenticate', webtoken);
}

function renew() {
  const token = store.get('zE_oauth').token;

  authenticateRequest('/embeddable/authenticate/renew', token);
}

function getToken() {
  if (isExpired()) {
    renew();
  } else {
    console.log('NOT EXPIRED');
  }

  return store.get('zE_oauth').token;
}

function renew() {
  const token = store.get('zE_oauth').token;
}

function authenticateRequest(path, params) {
  const payload = {
    method: 'POST',
    path: path,
    params: params,
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

function isExpired() {
  const zeoauth = store.get('zE_oauth');
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

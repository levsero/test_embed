import { mediator } from 'service/mediator';
import { store } from 'service/persistence';
import { transport } from 'service/transport';
import { base64encode, base64decode } from 'utility/utils';

function init() {
  mediator.channel.subscribe('authentication.logout', logout);
}

function authenticate(webToken) {
  const userHash = base64encode(decodeEmail(webToken));
  const currentToken = store.get('zE_oauth');

  if (currentToken === null || userHash !== currentToken.id) {
    store.remove('zE_oauth');
    requestToken(userHash, webToken);
  }
}

function getToken() {
  const zeoauth = store.get('zE_oauth');

  if (isExpired(zeoauth)) {
    store.remove('zE_oauth');
    return null;
  }

  return zeoauth.token;
}

function logout() {
  store.remove('zE_oauth');
}

// private

function requestToken(userHash, jwt) {
  const payload = {
    method: 'POST',
    path: '/embeddable/authenticate',
    params: { body: jwt },
    callbacks: {
      done: function(res) {
        if (res.status === 200) {
          store.set(
            'zE_oauth',
            {
              'id': userHash,
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

function isExpired(zeoauth) {
  const timeInterval = 1000 * 60 * 10; // 10 mins in ms

  if (zeoauth && zeoauth.expiry) {
    return Date.now() > zeoauth.expiry - timeInterval;
  } else {
    return false;
  }
}

function decodeEmail(jwt) {
  const decodedBody = base64decode(jwt.split('.')[1]);
  const message = JSON.parse(decodedBody);

  return message.email;
}

export const authentication = {
  init: init,
  authenticate: authenticate,
  getToken: getToken,
  logout: logout
};

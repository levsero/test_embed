import crypto from 'crypto';

import { mediator } from 'service/mediator';
import { store } from 'service/persistence';
import { transport } from 'service/transport';
import { base64decode } from 'utility/utils';

function init() {
  mediator.channel.subscribe('authentication.authenticate', authenticate);
  mediator.channel.subscribe('authentication.logout', logout);
}

function authenticate(webToken) {
  const userEmail = decodeEmail(webToken);

  if (userEmail === null) {
    return;
  }

  // md5 hash the email
  const userHash = crypto.createHash('md5').update(userEmail).digest('hex');
  const currentToken = store.get('zE_oauth');

  if (currentToken === null || userHash !== currentToken.id) {
    store.remove('zE_oauth');
    requestToken(userHash, webToken);
  }
}

function getToken() {
  const oauth = store.get('zE_oauth');

  if (!oauth || isExpired(oauth)) {
    store.remove('zE_oauth');
    return null;
  } else {
    return oauth.token;
  }
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
  const jwtBody = jwt.split('.')[1];

  if (typeof jwtBody === 'undefined') {
    return null;
  }

  const decodedBody = base64decode(jwtBody);
  const message = JSON.parse(decodedBody);

  return message.email;
}

export const authentication = {
  init: init,
  authenticate: authenticate,
  getToken: getToken,
  logout: logout
};

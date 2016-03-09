import crypto from 'crypto';
import { memoize } from 'lodash';

import { mediator } from 'service/mediator';
import { store } from 'service/persistence';
import { transport } from 'service/transport';
import { base64decode } from 'utility/utils';

function init() {
  mediator.channel.subscribe('authentication.authenticate', authenticate);
  mediator.channel.subscribe('authentication.logout', logout);
}

function authenticate(webToken) {
  const currentToken = store.get('zE_oauth');
  const tokenId = extractTokenId(webToken);

  if (currentToken === null || tokenId !== currentToken.id) {
    store.remove('zE_oauth');
    requestOAuthToken(webToken);
  } else {
    mediator.channel.broadcast('authentication.onSuccess');
  }
}

function getToken() {
  const currentToken = store.get('zE_oauth');

  if (isValid(currentToken)) {
    return currentToken.token;
  } else {
    store.remove('zE_oauth');
    return null;
  }
}

function logout() {
  store.remove('zE_oauth');
}

// private

function requestOAuthToken(jwt) {
  const payload = {
    method: 'POST',
    path: '/embeddable/authenticate',
    params: { body: jwt },
    callbacks: {
      done: function(res) {
        const tokenId = extractTokenId(jwt);

        if (res.status === 200) {
          store.set(
            'zE_oauth',
            {
              'id': tokenId,
              'token': res.body.oauth_token,
              'expiry': res.body.oauth_expiry
            }
          );
          mediator.channel.broadcast('authentication.onSuccess');
        }
      }
    }
  };

  transport.send(payload);
}

function isValid(token) {
  if (token && token.expiry) {
    const now = Math.floor(Date.now() / 1000);

    return token.expiry > now;
  } else {
    return false;
  }
}

const extractTokenId = memoize(function(jwt) {
  const jwtBody = jwt.split('.')[1];

  if (typeof jwtBody === 'undefined') {
    return null;
  }

  const decodedBody = base64decode(jwtBody);
  const message = JSON.parse(decodedBody);

  return message.email
    ? crypto.createHash('sha1').update(message.email).digest('hex')
    : null;
});

export const authentication = {
  init: init,
  authenticate: authenticate,
  getToken: getToken,
  logout: logout
};

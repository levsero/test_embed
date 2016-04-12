import crypto from 'crypto';
import { memoize } from 'lodash';

import { mediator } from 'service/mediator';
import { store } from 'service/persistence';
import { transport } from 'service/transport';
import { base64decode } from 'utility/utils';

function init() {
  mediator.channel.subscribe('authentication.renew', renew);
  mediator.channel.subscribe('authentication.logout', logout);
}

function authenticate(webToken) {
  const currentStoredToken = store.get('zE_oauth');
  const webTokenId = extractTokenId(webToken);

  if (currentStoredToken === null ||
      webTokenId !== currentStoredToken.id ||
      !isValid(currentStoredToken)) {
    store.remove('zE_oauth');
    requestOAuthToken(webToken);
  } else {
    mediator.channel.broadcast('authentication.onSuccess');
  }
}

function getToken() {
  const oauth = store.get('zE_oauth');

  return (oauth && oauth.token) ? oauth.token : null;
}

function logout() {
  store.remove('zE_oauth');
}

// private

function renew() {
  const currentToken = store.get('zE_oauth');

  if (shouldRenew(currentToken)) {
    renewOauthToken(currentToken);
    store.remove('zE_oauth');
  }
}

function requestOAuthToken(jwt) {
  const id = extractTokenId(jwt);
  const payload = {
    method: 'POST',
    path: '/embeddable/authenticate',
    params: { body: jwt },
    callbacks: {
      done: (res) => onRequestSuccess(res, id)
    }
  };

  transport.send(payload);
}

function renewOauthToken(token) {
  const id = token.id;
  const payload = {
    method: 'POST',
    path: '/embeddable/authenticate/renew',
    params: {
      body: token.token,
      expiry: token.expiry,
      id: token.id
    },
    callbacks: {
      done: (res) => onRequestSuccess(res, id)
    }
  };

  transport.send(payload);
}

function onRequestSuccess(res, id) {
  if (res.status === 200) {
    store.set(
      'zE_oauth',
      {
        'id': id,
        'token': res.body.oauth_token,
        'expiry': res.body.oauth_expiry
      }
    );
    mediator.channel.broadcast('authentication.onSuccess');
  }
}

function isValid(token, expiryInterval = 0) {
  if (token && token.expiry) {
    const now = Math.floor(Date.now() / 1000);

    return token.expiry > now + expiryInterval;
  } else {
    return false;
  }
}

function shouldRenew(token) {
  const time = 20 * 60; // 20 mins in secs

  return !isValid(token, time);
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

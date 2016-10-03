import _ from 'lodash';

import { mediator } from 'service/mediator';
import { store } from 'service/persistence';
import { settings } from 'service/settings';
import { transport } from 'service/transport';
import { base64decode,
         sha1 } from 'utility/utils';

const renewTime = 20 * 60; // 20 mins in secs

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

function renew() {
  const currentToken = store.get('zE_oauth');

  if (isRenewable(currentToken)) {
    renewOAuthToken(currentToken);
  }
}

function revoke(revokedAt) {
  const currentToken = store.get('zE_oauth');

  if (currentToken && isTokenRevoked(currentToken, revokedAt)) {
    logout();
  }
}

function logout() {
  store.remove('zE_oauth');
}

// private

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

function renewOAuthToken(token) {
  const id = token.id;
  const params = {
    body: settings.get('authenticate').jwt,
    token: {
      'oauth_token': token.token,
      'oauth_expiry': token.expiry
    }
  };
  const payload = {
    method: 'POST',
    path: '/embeddable/authenticate/renew',
    params: params,
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
        'expiry': res.body.oauth_expiry,
        'createdAt': res.body.oauth_created_at
      }
    );
    mediator.channel.broadcast('authentication.onSuccess');
  }
}

function isValid(token) {
  if (token && token.expiry) {
    const now = Math.floor(Date.now() / 1000);

    return token.expiry > now;
  } else {
    return false;
  }
}

function isRenewable(token) {
  if (token && token.expiry) {
    const now = Math.floor(Date.now() / 1000);
    const timeDiff = token.expiry - now;

    return timeDiff > 0 && timeDiff <= renewTime;
  } else {
    return false;
  }
}

function isTokenRevoked(token, revokedAt) {
  return token.createdAt <= revokedAt;
}

const extractTokenId = _.memoize(function(jwt) {
  const jwtBody = jwt.split('.')[1];

  if (typeof jwtBody === 'undefined') {
    return null;
  }

  const decodedBody = base64decode(jwtBody);
  const message = JSON.parse(decodedBody);

  return message.email ? sha1(message.email) : null;
});

export const authentication = {
  init: init,
  authenticate: authenticate,
  getToken: getToken,
  renew: renew,
  revoke: revoke,
  logout: logout
};

import { mediator } from 'service/mediator';
import { store } from 'service/persistence';
import { transport } from 'service/transport';
import { win } from 'util/globals';

function init() {
  mediator.channel.subscribe('authentication.authenticate', authenticate);
}

function authenticate(webToken) {
  const userHash = win.btoa(decodeEmail(webToken));
  const currentToken = store.get('zE_oauth');

  if (currentToken === null || userHash !== currentToken.id) {
    store.remove('zE_oauth');
    requestToken(userHash, webToken);
  }
}

function getToken() {
  return store.get('zE_oauth') ? store.get('zE_oauth').token : null;
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

function decodeEmail(jwt) {
  const decodedBody = win.atob(jwt.split('.')[1]);
  const message = JSON.parse(decodedBody);

  return message.email;
}

export const authentication = {
  init: init,
  authenticate: authenticate,
  getToken: getToken
};

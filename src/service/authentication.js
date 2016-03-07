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
          store.set('zE_oauth', {'token': res.body.oauth_token, 'expiry': res.body.oauth_expiry});
          mediator.channel.broadcast('authenticate.onSuccess');
        }
      }
    }
  };

  transport.send(payload);
}

function getToken() {
  return store.get('zE_oauth').token;
}

export const authentication = {
  init: init,
  authenticate: authenticate,
  getToken: getToken
};

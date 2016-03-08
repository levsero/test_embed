import { mediator } from 'service/mediator';
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
        // TODO: logic depending on the status we get
        return res;
      },
      fail: function(err) {
        return err;
      }
    }
  };

  transport.send(payload);
}

export const authentication = {
  init: init,
  authenticate: authenticate
};

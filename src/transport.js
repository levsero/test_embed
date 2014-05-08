var _ = require('lodash');

var superagent = require('superagent'),
    config = {
      scheme: 'https',
      snowflakeHost: 'zensnow.herokuapp.com'
    };

function init(_config) {
  config = _.extend(config, _config);
}

function send(payload) {
  superagent(payload.method.toUpperCase(),
             buildFullUrl(payload.path))
    .type('json')
    .send(_.extend(payload.params,{'zendesk_host': config.zendeskHost}))
    .end(function(res) {
      if (res.ok) {
        payload.callbacks.done(res.text, res.status, res.xhr);
      }
      else if (res.error) {
        payload.callbacks.fail(res.text, res.status, res.xhr);
      }
    });
}

function buildFullUrl(path) {
  return config.scheme + '://' + config.snowflakeHost + path;
}

export var transport = {
  init: init,
  send: send
};

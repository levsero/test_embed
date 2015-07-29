import _          from 'lodash';
import superagent from 'superagent';

let config;

function init(_config) {
  const defaultConfig = {
    scheme: 'https'
  };

  config = _.extend(defaultConfig, _config);
}

function send(payload) {
  if (!config.zendeskHost) {
    throw 'Missing zendeskHost config param.';
  }

  superagent(payload.method.toUpperCase(),
             buildFullUrl(payload.path))
    .type('json')
    .send(payload.params || {})
    .query(payload.query || {})
    .timeout(10000)
    .end(function(err, res) {
      if (payload.callbacks) {
        if (err) {
          if (_.isFunction(payload.callbacks.fail)) {
            payload.callbacks.fail(err);
          }
        } else {
          if (_.isFunction(payload.callbacks.done)) {
            payload.callbacks.done(res);
          }
        }
      }
    });
}

function buildFullUrl(path) {
  return config.scheme + '://' + config.zendeskHost + path;
}

function getZendeskHost() {
  return config.zendeskHost;
}

export var transport = {
  init: init,
  send: send,
  get: send,
  getZendeskHost: getZendeskHost
};

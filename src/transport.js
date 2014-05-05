import { _ } from 'lodash';

var xhr = require('xhr'),
    config = {
      scheme: 'https',
      snowflakeHost: 'zensnow.herokuapp.com'
    };

function init(_config) {
  config = _.extend(config, _config);
}

function send(payload) {

  var options = {
    uri:    buildFullUrl(payload.path),
    xhr:    new XMLHttpRequest(),
    method: payload.method.toUpperCase(),
    json:   _.extend(payload.params, {'zendesk_host': config.zendeskHost}),
    cors:   true
  },

  callback = function(err, xhr) {
    if (xhr.statusCode >= 200 && xhr.statusCode <= 300) {
      payload.callbacks.done(xhr.responseText, xhr.statusCode, xhr);
    }
    else if (xhr.statusCode >= 400) {
      payload.callbacks.fail(xhr, xhr.statusCode);
    }
  };

  xhr(options, callback);
}

function buildFullUrl(path) {
  return config.scheme + '://' + config.snowflakeHost + path;
}

export var transport = {
  init: init,
  send: send
};

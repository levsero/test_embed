var xhr = require('xhr'),
    config = {};

function init(_config) {
  config = _config;
}

function send(payload) {

  var options = {
    uri:    buildFullUrl(payload.path),
    xhr:    new XMLHttpRequest(),
    method: payload.method.toUpperCase(),
    data:   payload.parameters,
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
  return 'https://' + config.zendeskHost + path;
}

export var transport = {
  init: init,
  send: send
};

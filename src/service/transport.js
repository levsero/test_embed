require('imports?_=lodash!lodash');

var superagent = require('superagent'),
    config = {
      scheme: 'https',
      snowflakeHost: 'zensnow.herokuapp.com'
    };

function init(_config) {
  config = _.extend(config, _config);
}

function send(payload) {
  if (!config.zendeskHost) {
    throw 'Missing zendeskHost config param.';
  }

  superagent(payload.method.toUpperCase(),
             buildFullUrl(payload.path))
    .type('json')
    .send(_.extend(payload.params || {}, {'zendesk_host': config.zendeskHost}))
    .query(_.extend(payload.query || {}, {'zendesk_host': config.zendeskHost}))
    .end(function(res) {
      if (payload.callbacks) {
        if (res.ok) {
          if (_.isFunction(payload.callbacks.done)) {
            payload.callbacks.done(res.text, res.status, res.xhr);
          }
        }
        else if (res.error) {
          if (_.isFunction(payload.callbacks.fail)) {
            payload.callbacks.fail(res.text, res.status, res.xhr);
          }
        }
      }
    });
}

function bustCache() {
  var iframe = document.createElement('iframe'),
      onMessage = function(message) {
        if (message.data === 'cache_bust_done') {
          document.body.removeChild(iframe);
          window.removeEventListener('message', this);
        }
      },
      scriptSrc = document.getElementById('js-iframe-async').src;

  iframe.src = scriptSrc.replace(
    'main.js', 
    'update.html?' + (new Date()).getTime()) + '#placeholder-commit-hash';

  document.body.appendChild(iframe);

  window.addEventListener('message', onMessage, false);
}

function buildFullUrl(path) {
  return config.scheme + '://' + config.snowflakeHost + path;
}

export var transport = {
  init: init,
  send: send,
  bustCache: bustCache
};

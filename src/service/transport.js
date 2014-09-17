require('imports?_=lodash!lodash');

var superagent = require('superagent'),
    config;

function init(_config) {
  var defaultConfig = {
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
    .send(_.extend(payload.params || {}, {'zendesk_host': config.zendeskHost}))
    .query(_.extend(payload.query || {}, {'zendesk_host': config.zendeskHost}))
    .timeout(10000)
    .end(function(err, res) {
      if (payload.callbacks) {
        if (err) {
          if (err.timeout) {
            if (_.isFunction(payload.callbacks.timeout)) {
              payload.callbacks.timeout();
            }
          }
          else {
            if (_.isFunction(payload.callbacks.fail)) {
              payload.callbacks.fail();
            }
          }
        } else {
          if (res.ok) {
            if (_.isFunction(payload.callbacks.done)) {
              payload.callbacks.done(res.text, res.status, res.xhr);
            }
          }
        }
      }
    });
}

function bustCache(versionHash) {
  var iframe = document.createElement('iframe'),
      onMessage = function(message) {
        if (message.data === 'cache_bust_done') {
          iframe.parentNode.removeChild(iframe);
          window.removeEventListener('message', onMessage);
        }
      },
      scriptSrc,
      updateUrl,
      updatePath = [
        'update.html?',
        (new Date()).getTime(),
        `#${versionHash}`,
      ].join('');

  if (document.getElementById('js-iframe-async')) {
    scriptSrc = document.getElementById('js-iframe-async').src;
    updateUrl = scriptSrc.replace('main.js', updatePath);
    iframe.src = updateUrl;
    document.body.appendChild(iframe);
    window.addEventListener('message', onMessage, false);
  }
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
  getZendeskHost: getZendeskHost,
  bustCache: bustCache
};

import _          from 'lodash';
import superagent from 'superagent';

import { win } from 'utility/globals';
import { identity } from 'service/identity';

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

  if (__DEV__) {
    //
    // MOCK RESPONSES FOR PROTOTYPE TESTING
    //
    if (payload.path === '/embeddable/identify') {
      console.log(payload.params, payload.method, payload.path);
      setTimeout(function() {
        payload.callbacks.done({
          body: {
            npsSurvey: {
              commentsQuestion: 'Will you share why?',
              highlightColor: '#77a500',
              id: 10017,
              logoUrl: null,
              question: 'How likely are you to recommend Embeddable Nps to someone you know?',
              recipientId: 10035
            }
          }
        }); }, 3000);
      return;
    }

    if (payload.path === '/embeddable/nps') {
      console.log(payload.params, payload.method, payload.path);
      setTimeout(payload.callbacks.done, 1000);
      return;
    }
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

function sendWithMeta(payload) {
  const commonParams = {
    url: win.location.href,
    buid: identity.getBuid(),
    version: config.version,
    timestamp: (new Date()).toISOString()
  };

  payload.params = _.extend(commonParams, payload.params);

  send(payload);
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
  sendWithMeta: sendWithMeta,
  get: send,
  getZendeskHost: getZendeskHost
};

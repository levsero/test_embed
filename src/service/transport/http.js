import _          from 'lodash';
import superagent from 'superagent';

import { identity } from 'service/identity';
import { store } from 'service/persistence';
import { settings } from 'service/settings';
import { location } from 'utility/globals';
import { base64encode,
  referrerPolicyUrl } from 'utility/utils';

let config;
const defaultPayload = {
  path: '',
  callbacks: {
    done: () => {},
    fail: () => {},
    always: () => {}
  }
};

function init(_config) {
  const defaultConfig = {
    scheme: 'https',
    insecureScheme: 'http'
  };

  config = _.extend(defaultConfig, _config);
}

function updateConfig(updates) {
  config = _.extend(config, updates);
}

function getConfig() {
  return config;
}

function send(payload, addType = true) {
  if (!config.zendeskHost) {
    throw 'Missing zendeskHost config param.';
  }

  const request = superagent(payload.method.toUpperCase(),
    buildFullUrl(payload))
    .timeout(payload.timeout || 60000)
    .set('Authorization', payload.authorization);

  if (addType) request.type('json');

  if (payload.method.toUpperCase() === 'POST') {
    request.send(payload.params || {});
  }

  if (!_.isEmpty(payload.query)) request.query(payload.query);

  // in dev, skip the CDN cache by always appending a query string to bust the cache
  if (__DEV__ && payload.method.toUpperCase() === 'GET') {
    request.query({ _: Date.now() });
  }

  if (payload.locale) request.set('Accept-Language', payload.locale);

  request.end((err, res) => {
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
      if (_.isFunction(payload.callbacks.always)) {
        payload.callbacks.always();
      }
    }
  });
}

function sendWithMeta(payload) {
  const commonParams = {
    buid: identity.getBuid(),
    suid: identity.getSuid().id || null,
    version: config.version,
    timestamp: (new Date()).toISOString()
  };
  const referrerPolicy = store.get('referrerPolicy', 'session');
  const url = referrerPolicy ? referrerPolicyUrl(referrerPolicy, location.href) : location.href;
  const urlParams = url ? { url } : {};

  _.extend(payload.params, commonParams, urlParams);

  payload.query = {
    type: payload.type,
    data: base64encode(JSON.stringify(payload.params))
  };
  const base64Payload = _.pick(payload, ['method', 'path', 'query', 'callbacks']);

  send(base64Payload, false);
}

function sendFile(payload) {
  if (!config.zendeskHost) {
    throw 'Missing zendeskHost config param.';
  }

  /* eslint camelcase:0 */
  return superagent(payload.method.toUpperCase(),
    buildFullUrl(payload))
    .query({ filename: payload.file.name })
    .query({ via_id: settings.get('viaId') })
    .attach('uploaded_data', payload.file)
    .on('progress', function(e) {
      if (payload.callbacks) {
        if (_.isFunction(payload.callbacks.progress)) {
          payload.callbacks.progress(e);
        }
      }
    })
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

function getImage(payload) {
  payload = _.defaultsDeep({}, payload, defaultPayload);

  const { done, fail } = payload.callbacks;
  const onEnd = (err, res) => {
    if (err) {
      fail(err, res);
    } else {
      done(res);
    }
  };

  return superagent(payload.method, payload.path)
    .responseType('blob')
    .set('Authorization', payload.authorization)
    .end(onEnd);
}

function buildFullUrl(payload) {
  const scheme = payload.forceHttp ? config.insecureScheme : config.scheme;
  const host = payload.forceHttp ? location.hostname : getDynamicHostname(payload.useHostMappingIfAvailable);

  return scheme + '://' + host + payload.path;
}

function getDynamicHostname(useHostMappingIfAvailable) {
  return useHostMappingIfAvailable && config.hostMapping ? config.hostMapping : config.zendeskHost;
}

function callMeRequest(talkServiceUrl, payload) {
  superagent('POST', `${talkServiceUrl}/talk_embeddables_service/callback_request`)
    .send(payload.params)
    .end((err, res) => {
      const { done, fail } = payload.callbacks;

      if (err) {
        if (_.isFunction(fail)) {
          fail(err, res);
        }
      } else if (_.isFunction(done)) {
        done(res);
      }
    });
}

export const http = {
  init: init,
  send: send,
  sendWithMeta: sendWithMeta,
  sendFile: sendFile,
  getImage: getImage,
  get: send,
  callMeRequest,
  updateConfig,
  getConfig,
  getDynamicHostname
};

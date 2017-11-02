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

function send(payload, addType = true) {
  if (!config.zendeskHost) {
    throw 'Missing zendeskHost config param.';
  }

  if (__DEV__) {
    //
    // MOCK RESPONSES FOR PROTOTYPE TESTING
    //
    if (_.includes(payload.path, '/connect/api/ipm/pending_campaign')) {
      /* eslint no-console:0 */
      console.log(payload.params, payload.method, payload.path);
      setTimeout(function() {
        const ipm = {
          pendingCampaign: {
            id: 712,
            name: 'Campaign 712',
            type: 'ipm',
            recipientEmail: 'ryan@foo.com',
            message: {
              secondaryText: 'Ryan from Zendesk',
              body: 'Hi Deborah, we just launched a new product called People. Would you like to try it?',
              avatarUrl: 'https://avatars3.githubusercontent.com/u/143402?v=3&s=96',
              buttonUrl: 'http://www.example.com',
              buttonText: 'Take a look!',
              color: '#1393d0'
            }
          }
        };

        payload.callbacks.done({
          body: ipm
        });
      }, 3000);

      return;
    }

    // no need to actually send IPM results back in dev
    if (_.includes(payload.path, '/connect/api/ipm/campaign_events')) {
      console.log('Stubbing IPM request', payload);
      return;
    }
  }

  const request = superagent(payload.method.toUpperCase(),
    buildFullUrl(payload.path, payload.forceHttp))
    .timeout(payload.timeout || 60000)
    .set('Authorization', payload.authorization);

  if (addType) request.type('json');

  if (payload.method.toUpperCase() === 'POST') {
    request.send(payload.params || {});
  }

  if (payload.query) request.query(payload.query);

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

function sendWithMeta(payload, useBase64 = true) {
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

  if (useBase64) {
    payload.query = {
      type: payload.type,
      data: base64encode(JSON.stringify(payload.params))
    };
    const base64Payload = _.pick(payload, ['method', 'path', 'query', 'callbacks']);

    send(base64Payload, false);
  } else {
    send(payload);
  }
}

function sendFile(payload) {
  if (!config.zendeskHost) {
    throw 'Missing zendeskHost config param.';
  }

  /* eslint camelcase:0 */
  return superagent(payload.method.toUpperCase(),
                    buildFullUrl(payload.path))
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

function buildFullUrl(path, forceHttp = false) {
  const scheme = forceHttp ? config.insecureScheme : config.scheme;
  const host = forceHttp ? location.hostname : config.zendeskHost;

  return scheme + '://' + host + path;
}

function getZendeskHost() {
  return config.zendeskHost;
}

function automaticAnswersApiRequest(payload, formData = {}) {
  if (!config.zendeskHost) {
    throw 'Missing zendeskHost config param.';
  }

  superagent(payload.method.toUpperCase(), buildFullUrl(payload.path))
    // superAgent sets type('json') by default, which breaks CORS.
    // setting 'form-data' results in 'Content-type: www-url-form-encoded' to prevent a preflight OPTIONS request.
    .query(payload.queryParams)
    .type('form-data')
    .send(formData)
    .end((err, res) => {
      if (err) {
        if (_.isFunction(payload.callbacks.fail)) {
          payload.callbacks.fail(err, res);
        }
      } else {
        if (_.isFunction(payload.callbacks.done)) {
          payload.callbacks.done(res);
        }
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
  getZendeskHost: getZendeskHost,
  automaticAnswersApiRequest: automaticAnswersApiRequest
};

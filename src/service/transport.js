import _          from 'lodash';
import superagent from 'superagent';

import { settings } from 'service/settings';
import { identity } from 'service/identity';
import { location } from 'utility/globals';
import { base64encode } from 'utility/utils';

let config;

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
    if (payload.path === '/embeddable/identify') {
      /* eslint no-console:0 */
      console.log(payload.params, payload.method, payload.path);
      setTimeout(function() {
        const npsSurvey = {
          npsSurvey: {
            commentsQuestion: 'Can you tell us why?',
            highlightColor: '#77a500',
            id: 10017,
            logoUrl: null,
            question: 'How likely are you to recommend Embeddable Nps to someone you know?',
            recipientId: 10035,
            thankYou: 'Thank You',
            youRated: 'You rated us a',
            likelyLabel: '10 = Extremely likely',
            notLikelyLabel: '0 = Not at all likely',
            feedbackPlaceholder: 'Write your comments here...'
          }
        };

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

        const loadNPS = location.hash === '#zd-testNps';

        // change body to npsSurvey to test eNPS
        payload.callbacks.done({
          body: loadNPS ? npsSurvey : ipm
        });
      }, 3000);

      return;
    }

    // no need to actually send IPM results back in dev
    if (payload.path === '/embeddable/ipm') {
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
    }
  });
}

function sendWithMeta(payload, useBase64 = false) {
  const commonParams = {
    url: location.href,
    buid: identity.getBuid(),
    suid: identity.getSuid().id || null,
    version: config.version,
    timestamp: (new Date()).toISOString()
  };

  payload.params = _.extend(commonParams, payload.params);

  if (useBase64) {
    payload.query = { data: base64encode(JSON.stringify(payload.params)) };
    send({ method: 'get', path: payload.path, query: payload.query}, false);
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
  superagent(payload.method.toUpperCase(), payload.path)
    .timeout(60000)
    .responseType('blob')
    .set('Authorization', payload.authorization)
    .end(function(err, res) {
      if (payload.callbacks) {
        if (_.isFunction(payload.callbacks.done)) {
          payload.callbacks.done(res);
        }
      }
    });
}

function buildFullUrl(path, forceHttp = false) {
  const scheme = forceHttp ? config.insecureScheme : config.scheme;
  const host = forceHttp ? location.hostname : config.zendeskHost;

  return scheme + '://' + host + path;
}

function getZendeskHost() {
  return config.zendeskHost;
}

function automaticAnswersApiRequest(payload) {
  if (!config.zendeskHost) {
    throw 'Missing zendeskHost config param.';
  }

  superagent(payload.method.toUpperCase(), buildFullUrl(payload.path))
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

export const transport = {
  init: init,
  send: send,
  sendWithMeta: sendWithMeta,
  sendFile: sendFile,
  getImage: getImage,
  get: send,
  getZendeskHost: getZendeskHost,
  automaticAnswersApiRequest: automaticAnswersApiRequest
};

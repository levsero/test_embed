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

        const loadNPS = win.location.hash === '#zd-testNps';

        // change body to npsSurvey to test eNPS
        payload.callbacks.done({
          body: loadNPS ? npsSurvey : ipm
        });
      }, 3000);

      return;
    }
  }

  superagent(payload.method.toUpperCase(),
             buildFullUrl(payload.path))
    .type('json')
    .send(payload.params || {})
    .query(payload.query || {})
    .timeout(60000)
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

import Rollbar from 'vendor/rollbar.umd.min.js';

import { isIE } from 'utility/devices';
import { getEnvironment } from 'utility/utils';

let rollbar;
let useRollbar = false;
let errorServiceInitialised = false;
const errorMessageBlacklist = [
  'Access-Control-Allow-Origin',
  'timeout of [0-9]+ms exceeded',
  /^(\(unknown\): )?(Script error).?$/,
  'maxItems has been hit, ignoring errors until reset.',
  /Permission denied to access property "(.)+" on cross-origin object/
];
const hostBlackList = [
  /^((?!(.*(assets|static|static-staging)\.(zd-staging|zendesk|zdassets)\.com)).*)$/
];
const rollbarConfig =  {
  accessToken: '94eb0137fdc14471b21b34c5a04f9359',
  captureUncaught: true,
  captureUnhandledRejections: true,
  hostBlackList: hostBlackList,
  hostWhiteList: ['assets.zd-staging.com', 'assets.zendesk.com'],
  endpoint: 'https://rollbar-eu.zendesk.com/api/1/item/',
  ignoredMessages: errorMessageBlacklist,
  maxItems: 10,
  payload: {
    environment: getEnvironment(),
    client: {
      javascript: {
        code_version: __EMBEDDABLE_VERSION__ // eslint-disable-line camelcase
      }
    }
  }
};

function init(shouldUseRollbar = false) {
  useRollbar = !isIE() && shouldUseRollbar;

  if (useRollbar) {
    rollbar = Rollbar.init(rollbarConfig);
    errorServiceInitialised = true;
  }
}

function error(err, customData) {
  if (__DEV__) {
    /* eslint no-console:0 */
    console.error(err.error.message || err.error);
  } else {
    if (err.error.special) {
      throw err.error.message;
    } else if (errorServiceInitialised) {
      pushError(err, customData);
    }
  }
}

function pushError(err, customData) {
  if (useRollbar) {
    rollbar.error(err, customData);
  }
}

export const logging = {
  init,
  error,

  // Exported for testing
  errorMessageBlacklist,
  hostBlackList
};

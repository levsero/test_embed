import _ from 'lodash';
import Rollbar from 'vendor/rollbar.umd.min.js'; // eslint-disable-line import/extensions

import { isIE } from 'utility/devices';
import { rollbarConfig } from './config';

let rollbar;
let useRollbar = false;
let errorServiceInitialised = false;

function init(errorReportingEnabled = true) {
  if (errorReportingEnabled) {
    useRollbar = !isIE();

    if (useRollbar) {
      rollbar = Rollbar.init(rollbarConfig);
      errorServiceInitialised = true;
    }
  }
}

function error(err, customData) {
  if (__DEV__) {
    /* eslint no-console:0 */
    console.error(err);
  } else {
    if (_.get(err, 'error.special')) {
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

function setInitialise(initialise) {
  errorServiceInitialised = initialise;
}

module.exports = {
  logging: {
    init,
    error
  },
  setInitialise // for testing only
};

import _ from 'lodash';
import Rollbar from 'rollbar';

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

export function setInitialise(initialise) {
  errorServiceInitialised = initialise;
}
export const logging = {
  init,
  error
};

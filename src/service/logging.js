import airbrakeJs from 'airbrake-js';
import Rollbar from 'vendor/rollbar.umd.nojson.min.js';
import _ from 'lodash';

let airbrake;
let rollbar;
let useRollbar;
const errorMessageBlacklist = [
  'Access-Control-Allow-Origin',
  'timeout of [0-9]+ms exceeded'
];

// Remove this code once Rollbar is GA'd
const errorFilter = (notice) => {
  const errorMessageRegex = new RegExp(errorMessageBlacklist.join('|'));

  notice.errors = _.filter(notice.errors, (error) => {
    const validBacktrace = _.some(error.backtrace, (backtrace) => {
      // TODO: Once we know what the path will look like for asset composer build,
      // allow this filtering to handle that too.
      return _.includes(backtrace.file, '/embeddable_framework/main.js');
    });

    return validBacktrace && !errorMessageRegex.test(error.message);
  });

  // airbrake-js will filter out the error if null is returned, and will
  // send it through if the notice object is returned.
  // See #Filtering Errors: https://github.com/airbrake/airbrake-js
  return notice.errors.length > 0 ? notice : null;
};

const getRollbarConfig = () => {
  return {
    accessToken: '94eb0137fdc14471b21b34c5a04f9359',
    captureUncaught: true,
    captureUnhandledRejections: true,
    endpoint: 'https://rollbar-eu.zendesk.com/api/1/',
    hostWhiteList: ['assets.zendesk.com'],
    ignoredMessages: errorMessageBlacklist,
    maxItems: 100,
    payload: {
      environment: 'production',
      client: {
        javascript: {
          code_version: __EMBEDDABLE_VERSION__ // eslint-disable-line camelcase
        }
      }
    }
  };
};

function init(configRollbar = false) {
  useRollbar = configRollbar;

  if (useRollbar) {
    rollbar = Rollbar.init(getRollbarConfig());
  } else {
    // Remove this code once Rollbar is GA'd
    airbrake = new airbrakeJs({
      projectId: '124081',
      projectKey: '8191392d5f8c97c8297a08521aab9189'
    });
    airbrake.addFilter(errorFilter);
  }
}

function error(err) {
  if (__DEV__) {
    /* eslint no-console:0 */
    console.error(err.error.message || err.error);
  } else {
    if (err.error.special) {
      throw err.error.message;
    } else {
      // Remove this code once Rollbar is GA'd
      (useRollbar)
        ? rollbar.error(err)
        : airbrake.notify(err);
    }
  }
}

function warn(...warning) {
  // Make this a variable so that it doesn't get stripped by webpack.
  const warn = console.warn; // eslint-disable-line no-console

  warn(...warning);
}

export const logging = {
  init,
  error,
  errorFilter,
  warn,

  // Exported for testing
  getRollbarConfig
};

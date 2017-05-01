import airbrakeJs from 'airbrake-js';
import Rollbar from 'vendor/rollbar.umd.nojson.min.js'
import _ from 'lodash';

let airbrake;
const errorMessageBlacklist = [
  'Access-Control-Allow-Origin',
  'timeout of [0-9]+ms exceeded'
];

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

const wrap = (fn) => airbrake.wrap(fn);

function init() {
  airbrake = new airbrakeJs({
    projectId: '124081',
    projectKey: '8191392d5f8c97c8297a08521aab9189'
  });
  airbrake.addFilter(errorFilter);

  const rollbarConfig = {
    // hostWhiteList: ['assets.zendesk.com'],
    accessToken: '656217fa4a6e4ad797e525cfd8c129cf',
    // endpoint: 'https://rollbar-eu.zendesk.com/api/1/',
    // accessToken: '94eb0137fdc14471b21b34c5a04f9359',
    maxItems: 100,
    captureUncaught: true,
    captureUnhandledRejections: true,
    ignoredMessages: errorMessageBlacklist,
    payload: {
      environment: 'production',
      client: {
        javascript: {
          code_version: __EMBEDDABLE_VERSION__
        }
      }
    }
  };

  Rollbar.init(rollbarConfig);
}

function error(err) {
  if (__DEV__) {
    /* eslint no-console:0 */
    console.error(err.error.message || err.error);
  } else {
    if (err.error.special) {
      throw err.error.message;
    } else {
      airbrake.notify(err);
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
  warn
};

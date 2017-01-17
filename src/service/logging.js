import airbrakeJs from 'airbrake-js';
import _ from 'lodash';

let airbrake;

const errorFilter = (notice) => {
  const errorMessageBlacklist = [
    'Access-Control-Allow-Origin',
    'timeout of [0-9]+ms exceeded'
  ];
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

export const logging = {
  init,
  error,
  wrap,
  errorFilter
};

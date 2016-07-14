import airbrakeJs from 'airbrake-js';

import { win } from 'utility/globals';

let airbrake;
const errorFilters = [
  'Access-Control-Allow-Origin',
  'timeout of [0-9]+ms exceeded'
];

const errorFilter = (notice) => {
  const combinedRegex = new RegExp(errorFilters.join('|'));

  // The notice object always contains a single element errors array.
  // airbrake-js will filter out the error if null is returned, and will
  // send it through if the notice object is returned.
  // See #Filtering Errors: https://github.com/airbrake/airbrake-js
  return combinedRegex.test(notice.errors[0].message)
         ? null
         : notice;
};

const wrap = (fn) => airbrake.wrap(fn);

function init() {
  // airbrake-js by default will register an event handler to
  // `window.onerror`. We only want to allow this behaviour if our
  // `window` is within the iframe. Some host pages have main.js embedded
  // within the main document.body, meaning we push runtime errors we don't
  // care about to airbrake.
  const registerOnError = win !== window;

  airbrake = new airbrakeJs({
    projectId: '124081',
    projectKey: '8191392d5f8c97c8297a08521aab9189',
    onerror: registerOnError
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

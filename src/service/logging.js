import airbrakeJs from 'airbrake-js';

const airbrake = new airbrakeJs();
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
  airbrake.setProject('124081', '8191392d5f8c97c8297a08521aab9189');
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

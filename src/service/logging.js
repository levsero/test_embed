import airbrakeJs from 'airbrake-js';

const airbrake = new airbrakeJs();
const errorFilters = [
  'Access-Control-Allow-Origin',
  'timeout of [0-9]+ms exceeded'
];

const errorFilter = (notice) => {
  const combinedRegex = new RegExp(errorFilters.join('|'));

  return combinedRegex.test(notice.errors[0].message)
         ? null
         : notice;
};

function init() {
  airbrake.setProject({ projectId: '124081', projectKey: '8191392d5f8c97c8297a08521aab9189' });
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
      airbrake.notify({error: err});
    }
  }
}

export const logging = {
  init,
  error,
  errorFilter
};

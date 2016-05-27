import _ from 'lodash';
import airbrakeJs from 'airbrake-js';

const airbrake = new airbrakeJs({projectId: '124081', projectKey: '8191392d5f8c97c8297a08521aab9189'});

const errorFilters = [
  'Access-Control-Allow-Origin',
  '/timeout of [0-9]+ms exceeded/'
];

function addFilter(notice) {
  const nonFilteredErrors = _.reject(notice.errors, (err) => {
    let ret;

    _.forEach(errorFilters, (pat) => {
      ret = err.message.search(pat) < 0;
      if (ret) { return false; }
    });

    return ret;
  });

  return (nonFilteredErrors.length > 0 ? notice : null);
}

function init() {
  //airbrake.addFilter(addFilter);
  airbrake.notify({error: new Error("ERROR HERE")});
}

function error(err) {
  if (!__DEV__) {
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
  init: init,
  error: error
};

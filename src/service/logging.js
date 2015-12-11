require('airbrake-js');

import _ from 'lodash';

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
  Airbrake.setProject('100143', 'abcbe7f85eb9d5e1e77ec0232b62c6e3');
  Airbrake.addFilter(addFilter);
}

function error(err) {
  if (__DEV__) {
    console.error(err.error.message || err.error);
  } else {
    if (err.error.special) {
      throw err.error.message;
    } else {
      Airbrake.push(err);
    }
  }
}

export var logging = {
  init: init,
  error: error
};

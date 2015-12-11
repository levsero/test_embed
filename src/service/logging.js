require('airbrake-js');

import _ from 'lodash';

function init(errorsToIgnore) {
  Airbrake.setProject('100143', 'abcbe7f85eb9d5e1e77ec0232b62c6e3');
  Airbrake.addFilter((notice) => {
    let ret = notice;
    _.forEach(notice.errors, (err) => {
      if (errorsToIgnore.indexOf(err.message) > -1) {
        ret = null;
      }
    });

    return ret;
  });
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

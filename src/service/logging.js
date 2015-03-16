require('airbrake-js');

function init() {
  Airbrake.setProject('100143', 'abcbe7f85eb9d5e1e77ec0232b62c6e3');
}

function error(err) {
  if (__DEV__) {
    console.error(err.error.message || err.error);
  } else {
    if(err.error.special) {
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

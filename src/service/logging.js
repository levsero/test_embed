require('airbrake-js');

function init() {
  Airbrake.setProject('100143', 'abcbe7f85eb9d5e1e77ec0232b62c6e3');
}

export var logging = {
  init: init
};

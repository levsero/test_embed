import { win } from 'util/globals';

require('imports?self=>window.top!airbrake-js');

function errors() {
  win.Airbrake = [];
  win.Airbrake.wrap = wrap;
  win.Airbrake.onload = function(client) {
    client.setProject('100143', 'abcbe7f85eb9d5e1e77ec0232b62c6e3');
  };
}

function wrap(fn) {
  var airbrakeWrapper = function() {
    try {
      return fn.apply(this, arguments);
    } catch (exc) {
      var args = Array.prototype.slice.call(arguments);
      win.Airbrake.push({error: exc, params: {arguments: args}});
    }
  };
  if (fn.guid) {
    airbrakeWrapper.guid = fn.guid;
  }
  return airbrakeWrapper;
}

// Reports unhandled exceptions.
win.addEventListener('error', function(message, file, line, column, error) {
  if (error) {
    win.Airbrake.push({error: error});
  } else {
    win.Airbrake.push({error: {
      message: message,
      fileName: file,
      lineNumber: line,
      columnNumber: column || 0
    }});
  }
}, false);

export var logging = {
  errors: errors
};

import { cacheBuster } from 'service/cacheBuster';

var win = cacheBuster.isCacheBusting(window.name) ? window : window.top,
    document = win.document, /* jshint ignore:line */
    navigator = win.navigator, /* jshint ignore:line */
    location = win.location; /* jshint ignore:line */

function getDocumentHost() {
  return document.body || document.documentElement;
}

// Shim rAF for older browsers that either don't have it or need the prefixed version.
// Attaching to the iframe window as that's what snabbt looks at.
(function() {
  var lastTime = 0,
      vendors = ['webkit', 'moz'];

  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      var currTime = new Date().getTime(),
          timeToCall = Math.max(0, 16 - (currTime - lastTime)),
          id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);

      lastTime = currTime + timeToCall;
      return id;
    };
  }
}());

export { win, document, navigator, location, getDocumentHost };


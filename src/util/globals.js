import { cacheBuster } from 'service/cacheBuster';

const win = cacheBuster.isCacheBusting(window.name) ? window : window.parent;
const document = win.document;
const navigator = win.navigator;
const location = win.location;

function getDocumentHost() {
  return document.body || document.documentElement;
}

// Shim rAF for older browsers that either don't have it or need the prefixed version.
(function() {
  let lastTime = 0;
  const vendors = ['webkit', 'moz'];

  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);

      lastTime = currTime + timeToCall;
      return id;
    };
  }
}());

export { win, document, navigator, location, getDocumentHost };

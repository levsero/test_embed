import _ from 'lodash';
import {
  getMetaTagsByName,
  appendMetaTag
} from 'utility/devices';

const win = window.parent;
const document = win.document;
const navigator = win.navigator;
const location = win.location;

let referrerPolicy = '';

const getReferrerPolicy = () => referrerPolicy;

const setReferrerMetas = (iframe, doc) => {
  const metaElements = getMetaTagsByName(doc, 'referrer');
  const referrerMetas = _.map(metaElements, (meta) => meta.content);
  const iframeDoc = iframe.contentDocument;

  _.forEach(referrerMetas, (content) => appendMetaTag(iframeDoc, 'referrer', content));

  if (referrerMetas.length > 0) {
    referrerPolicy = _.last(referrerMetas);
  }
};

function getDocumentHost() {
  return document.body || document.documentElement;
}

const getZendeskHost = (doc) => {
  const path = 'web_widget.id';

  return doc.zendeskHost || _.get(doc.zendesk, path) || _.get(doc, path);
};

const isPopout = () => win.zEPopout === true;

// Shim rAF for older browsers that either don't have it or need the prefixed version.
// Attaching to the iframe window as that's what snabbt looks at.
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

export {
  win,
  document,
  navigator,
  location,
  getDocumentHost,
  getZendeskHost,
  isPopout,
  setReferrerMetas,
  getReferrerPolicy
};

import { cacheBuster } from 'service/cacheBuster';

const win = cacheBuster.isCacheBusting(window.name) ? window : window.parent;
const document = win.document;
const navigator = win.navigator;
const location = win.location;

function getDocumentHost() {
  return document.body || document.documentElement;
}

export { win, document, navigator, location, getDocumentHost };

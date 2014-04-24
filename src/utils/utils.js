import { store } from './persistence';

var anchor = document.createElement('a');

function hex() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function generateBuid() {
  return [
    hex(), hex(), hex(), hex(), hex(), hex(), hex(), hex()
  ].join('');
}

function getBuid() {
  var buid = store.get('buid');

  if(!buid) {
    buid = store.set('buid', generateBuid());
  }

  return buid;
}

function parseUrl(url) {
  anchor.href = url;

  return anchor;
}

export { getBuid, parseUrl };

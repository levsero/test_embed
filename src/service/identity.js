import { store } from 'service/persistence';

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

  if (!buid) {
    buid = store.set('buid', generateBuid());
  }

  return buid;
}

export var identity = {
  getBuid: getBuid
};

import { store } from 'service/persistence';
import _ from 'lodash';

const timeToExpire = 1000*60*15; // 15 Minutes

const hex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

const generateUid = () => _.times(8, () => hex()).join('');

const setSuid = (id, expiry, tabCount, tabExpiry) => {
  return store.set('suid', {
    id: id,
    expiry: expiry,
    tabs: {
      count: tabCount,
      expiry: tabExpiry
    }
  });
};

const checkSuid = (suid) => {
  const now = Date.now();

  // If the session hasn't expired
  // if there is more then one tab or tab hasn't expired
  return suid &&
         suid.expiry > now &&
         (suid.tabs.count !== 0 || suid.tabs.expiry > now);
};

function init() {
  const suid = store.get('suid');
  const expiry = Date.now() + timeToExpire;

  checkSuid(suid) ? setSuid(suid.id, expiry, suid.tabs.count + 1, 0)
                  : setSuid(generateUid(), expiry, 1, 0);
}

function getBuid() {
  let buid = store.get('buid');

  if (!buid) {
    buid = store.set('buid', generateUid());
  }

  return buid;
}

function getSuid() {
  const suid = store.get('suid');
  const expiry = Date.now() + timeToExpire;

  return checkSuid(suid) ? suid
                         : setSuid(generateUid(), expiry, 1, 0);
}

function unload() {
  const now = Date.now();
  const suid = store.get('suid');
  const tabExpiry = now + 1000*30; // 30 seconds

  if (suid) {
    setSuid(suid.id, suid.expiry, suid.tabs.count - 1, tabExpiry);
  }
}

export const identity = {
  getBuid: getBuid,
  getSuid: getSuid,
  init: init,
  unload: unload
};

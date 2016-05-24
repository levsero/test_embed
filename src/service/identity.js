import { store } from 'service/persistence';

const hex = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

const generateBuid = () => {
  return [
    hex(), hex(), hex(), hex(), hex(), hex(), hex(), hex()
  ].join('');
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
  const expiry = Date.now() + 1000*60*15; // 15 minutes

  if (checkSuid(suid)) {
    store.set('suid', {
      id: suid.id,
      expiry: expiry,
      tabs: {
        count : suid.tabs.count + 1,
        expiry: 0
      }
    });
  } else {
    store.set('suid', {
      id: generateBuid(),
      expiry: expiry,
      tabs: {
        count : 1,
        expiry: 0
      }
    });
  }
}

function getBuid() {
  let buid = store.get('buid');

  if (!buid) {
    buid = store.set('buid', generateBuid());
  }

  return buid;
}

function getSuid() {
  const suid = store.get('suid');
  const expiry = Date.now() + 1000*60*15; // 15 minutes

  return checkSuid(suid) ? suid
                         : store.set(
                           'suid',
                           {
                             id: generateBuid(),
                             expiry: expiry,
                             tabs: {
                               count : 1,
                               expiry: 0
                             }
                           });
}

function unload() {
  const now = Date.now();
  const suid = store.get('suid');
  const expiry = now + 1000*30; // 30 seconds

  if (suid) {
    store.set('suid', {
      id: suid.id,
      expiry: suid.expiry,
      tabs: {
        count: suid.tabs.count - 1,
        expiry: expiry
      }
    });
  }
}

export const identity = {
  getBuid: getBuid,
  getSuid: getSuid,
  init: init,
  unload: unload
};

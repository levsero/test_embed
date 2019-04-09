import _ from 'lodash';

import { win } from 'utility/globals';
import { getCookiesDisabled } from 'src/redux/modules/settings/settings-selectors';

const prefix = 'ZD-';

// TODO: find a better way to differentiate between localStorage
// and sessionStorage, and refactor everywhere it is used

let reduxStore;

function init(store) {
  reduxStore = store;
}

const storage = (type) => win[`${type}Storage`];

function get(name, type = 'local') {
  try {
    return deserialize(storage(type).getItem(prefix + name));
  } catch (e) {}
}

function set(name, data, type = 'local') {
  if (getCookiesDisabled(reduxStore.getState())) return data;

  try {
    storage(type).setItem(prefix + name, serialize(data));
  } catch (e) {}

  return data;
}

function remove(name, type = 'local') {
  try {
    storage(type).removeItem(prefix + name);
  } catch (e) {}
}

function clear(type = 'local') {
  try {
    const backend = storage(type);
    const keys = _.keys(backend).filter((key) => (
      _.includes(key, prefix)
    ));

    keys.forEach((key) => {
      backend.removeItem(key);
    });
  } catch (e) {}
}

function serialize(data) {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  return data;
}

function deserialize(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

export const store = {
  init,
  get: get,
  set: set,
  remove: remove,
  clear: clear
};

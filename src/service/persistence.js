import _ from 'lodash';

import { win } from 'utility/globals';

const prefix = 'ZD-';

// TODOD: find a better way to differentiate between localStorage
// and sessionStorage, and refactor everywhere it is used

const storage = (type) => win[`${type}Storage`];

function get(name, type = 'local') {
  try {
    return deserialize(storage(type).getItem(prefix + name));
  } catch (e) {}
}

function set(name, data, type = 'local') {
  try {
    storage(type).setItem(prefix + name, serialize(data));
  } catch (e) {}

  return data;
}

function remove(name, type = 'local') {
  storage(type).removeItem(prefix + name);
}

function clear(type = 'local') {
  const backend = storage(type);
  const keys = _.chain(_.keys(backend))
                .filter((key) => {
                  return key.indexOf(prefix) === 0;
                })
                .value();

  _.forEach(keys, (key) => {
    backend.removeItem(key);
  });
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
  get: get,
  set: set,
  remove: remove,
  clear: clear
};

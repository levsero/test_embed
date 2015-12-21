import _ from 'lodash';

import { win } from 'utility/globals';

const prefix = 'ZD-';

const store = {
  get: get,
  set: set,
  remove: remove,
  clear: clear
};

function storage(session) {
  const type = session ? 'session' : 'local';

  return win[type + 'Storage'];
}

function get(name, session) {
  try {
    return deserialize(storage(session).getItem(prefix + name));
  } catch (e) {}
}

function set(name, data, session) {
  try {
    storage(session).setItem(prefix + name, serialize(data));
  } catch (e) {}

  return data;
}

function remove(name, session) {
  storage(session).removeItem(prefix + name);
}

function clear(session) {
  const backend = storage(session);
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

export { store };

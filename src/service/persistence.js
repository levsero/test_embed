import _ from 'lodash';

import { win } from 'utility/globals';

var prefix = 'ZD-';

var store = {
  get: get,
  set: set,
  remove: remove,
  clear: clear
};

function storage(session) {
  var type = session ? 'session' : 'local';

  return win[type + 'Storage'];
}

function get(name, session) {
  try {
    return deserialize(storage(session).getItem(prefix + name));
  } catch(e) {}
}

function set(name, data, session) {
  try {
    storage(session).setItem(prefix + name, serialize(data));
  } catch(e) {}

  return data;
}

function remove(name, session) {
  storage(session).removeItem(prefix + name);
}

function clear(session) {
  var backend = storage(session),
      keys = _.keys(backend);

  _.chain(keys)
    .filter(function(key) {
      return key.indexOf(prefix) === 0;
    })
    .each(function(key) {
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
  } catch(e) {
    return data;
  }
}

export { store };

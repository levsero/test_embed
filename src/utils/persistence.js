import { win } from './globals';

var prefix = 'ZD-';

var store = {
  get: get,
  set: set,
  remove: remove,
  clear: clear,
  serialize: serialize,
  deserialize:  deserialize
};

function storage(session) {
  var type = session ? 'session' : 'local';

  return win[type + 'Storage'];
}

function get(name, session) {
  return deserialize(storage(session).getItem(prefix + name));
}

function set(name, data, session) {
  storage(session).setItem(prefix + name, serialize(data));

  return data;
}

function remove(name, session) {
  storage(session).removeItem(prefix + name);
}

function clear(name, session) {
  storage(session).clear();
}

function serialize(data) {
  if(typeof data === 'object') {
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

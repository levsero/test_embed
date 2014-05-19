import { win } from 'util/globals';
require('imports?_=lodash!lodash');

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
  return deserialize(storage(session).getItem(prefix + name));
}

function set(name, data, session) {
  storage(session).setItem(prefix + name, serialize(data));

  return data;
}

function remove(name, session) {
  storage(session).removeItem(prefix + name);
}

function clear(session) {
  var keys = _.keys(storage(session));
  _.chain(keys)
    .filter(function(key) { 
      return key.indexOf(prefix) === 0;
    })
    .each(function(key) {
      storage(session).removeItem(key);
    });
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

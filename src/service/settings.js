let store = {};

function set(name, value) {
  store[name] = value;
}

function get(name) {
  if (store[name]) {
    return store[name];
  } else {
    return null;
  }
}

export const settings = {
  set: set,
  get: get
};

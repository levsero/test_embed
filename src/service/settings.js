let store = {};

function init(params = {}) {
  if (params.authenticate) {
    store.authenticationToken = params.authenticate;
  }
}

function get(name) {
  return store[name] || null;
}

export const settings = {
  init: init,
  get: get
};

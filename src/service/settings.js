let store = {};

function init(params = {}) {
  if (params.authenticate) {
    store.authenticate = params.authenticate;
  }
  if (params.suppress) {
    store.suppress = params.suppress;
  }
}

function get(name) {
  return store[name] || null;
}

export const settings = {
  init: init,
  get: get
};

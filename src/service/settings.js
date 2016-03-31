let store = {
  offset: {
    horizontal: 0,
    vertical: 0
  },
  widgetMargin: 15
};

function init(params = {}) {
  if (params.authenticate) {
    store.authenticate = params.authenticate;
  }
  if (params.suppress) {
    store.suppress = params.suppress;
  }
  if (params.offset) {
    store.offset = params.offset;
  }
}

function get(name) {
  return store[name] || null;
}

export const settings = {
  init: init,
  get: get
};

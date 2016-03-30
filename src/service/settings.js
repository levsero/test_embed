import { mediator } from 'service/mediator';

let store = {};

function init(params = {}) {
  if (params.authenticate) {
    store.authenticate = params.authenticate;
  }
  if (params.suppress) {
    mediator.suppress(params.suppress);
  }
}

function get(name) {
  return store[name] || null;
}

export const settings = {
  init: init,
  get: get
};

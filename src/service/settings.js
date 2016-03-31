import { forEach, pick } from 'lodash';

import { win } from 'utility/globals';

const optionWhitelist = [
  'authenticate',
  'translations',
  'suppress',
  'offset'
];
let store = {
  offset: {
    horizontal: 0,
    vertical: 0
  },
  widgetMargin: 15
};

function init() {
  if (!win.zESettings) {
    return;
  }

  const whiteListedParams = pick(win.zESettings, optionWhitelist);

  forEach(whiteListedParams, (val, key) => {
    store[key] = val;
  });
}

function get(name) {
  return store[name] || null;
}

export const settings = {
  init: init,
  get: get
};

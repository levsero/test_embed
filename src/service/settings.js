import _ from 'lodash';

import { win } from 'utility/globals';

const optionWhitelist = [
  'authenticate',
  'translations',
  'suppress',
  'attachmentsDisabled',
  'offset'
];
let store = {
  offset: {
    horizontal: 0,
    vertical: 0
  },
  widgetMargin: 15,
  widgetViaId: 48
};

function init() {
  if (!win.zESettings) return;

  const whiteListedParams = _.pick(win.zESettings, optionWhitelist);

  _.merge(store, whiteListedParams);
}

function get(name) {
  return store[name] || null;
}

export const settings = {
  init: init,
  get: get
};

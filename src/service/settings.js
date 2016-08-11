import _ from 'lodash';

import { win } from 'utility/globals';

const webWidgetOptionWhitelist = [
  'authenticate',
  'translations',
  'suppress',
  'contactForm.attachments',
  'offset',
  'color',
  'helpCenter.viewOriginalArticleButton'
];
const ipmOptionWhitelist = [
  'offset'
];
let webWidgetStore = {
  offset: {
    horizontal: 0,
    vertical: 0
  },
  widgetMargin: 15,
  widgetViaId: 48,
  helpCenter: {
    viewOriginalArticleButton: true
  }
};
let ipmStore = {
  offset: {
    horizontal: 0,
    vertical: 0
  }
};

const initStore = (settings, store, options) => {
  if (!settings) return;

  let whiteListedParams = {};

  _.forEach(options, (option) => {
    if (_.has(settings, option)) {
      _.set(whiteListedParams, option, settings[option]);
    }
  });

  _.merge(store, whiteListedParams);
}

function init() {
  const settings = win.zESettings;

  if (!settings) return;

  initStore(settings.webWidget, webWidgetStore, webWidgetOptionWhitelist);
  initStore(settings.ipm, ipmStore, ipmOptionWhitelist);
}

function get(name) {
  return webWidgetStore[name] || null;
}

export const settings = {
  init: init,
  get: get
};

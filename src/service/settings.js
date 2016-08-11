import _ from 'lodash';

import { win } from 'utility/globals';

const optionWhitelist = {
  webWidget: [
    'authenticate',
    'contactForm.attachments',
    'offset',
    'color',
    'helpCenter.viewOriginalArticleButton',
    'helpCenter.suppressed',
    'chat.suppressed',
    'launcher.label'
  ],
  ipm: [
    'offset'
  ]
};
let webWidgetStore = {
  offset: {
    horizontal: 0,
    vertical: 0
  },
  widgetMargin: 15,
  widgetViaId: 48,
  helpCenter: {
    viewOriginalArticleButton: true
  },
  contactForm: {
    attachments: true
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
      _.set(whiteListedParams, option, _.get(settings, option, null));
    }
  });

  _.merge(store, whiteListedParams);
};

function init() {
  const settings = win.zESettings;

  if (!settings) return;

  initStore(settings.webWidget, webWidgetStore, optionWhitelist.webWidget);
  initStore(settings.ipm, ipmStore, optionWhitelist.ipm);
}

function get(path, store = 'webWidget') {
  return store === 'webWidget' ? _.get(webWidgetStore, path, null)
                              : _.get(ipmStore, path, null);
}

export const settings = {
  init: init,
  get: get
};

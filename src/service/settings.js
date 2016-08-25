import _ from 'lodash';

import { win } from 'utility/globals';

const optionWhitelist = {
  webWidget: [
    'authenticate',
    'chat.suppress',
    'color',
    'contactForm.attachments',
    'contactForm.title',
    'helpCenter.chatButton',
    'helpCenter.messageButton',
    'helpCenter.originalArticleButton',
    'helpCenter.suppress',
    'helpCenter.title',
    'launcher.chatLabel',
    'launcher.label',
    'offset'
  ],
  ipm: [
    'offset'
  ]
};
const customizationsWhitelist = [
  'offset',
  'helpCenter.originalArticleButton',
  'chat.suppress',
  'helpCenter.suppress'
];
const webWidgetStoreDefaults = {
  contactForm: {
    attachments: true
  },
  helpCenter: {
    originalArticleButton: true
  },
  launcher: {},
  margin: 15,
  offset: {
    horizontal: 0,
    vertical: 0
  },
  viaId: 48
};
const ipmStoreDefaults = {
  offset: {
    horizontal: 0,
    vertical: 0
  }
};
let webWidgetStore = {};
let ipmStore = {};
let webWidgetCustomizations = false;

const initStore = (settings, options, defaults) => {
  const reduceFn = (res, val) => {
    if (_.has(settings, val)) {
      _.set(res, val, _.get(settings, val, null));
    }
    return res;
  };

  return _.chain(options)
          .reduce(reduceFn, {})
          .defaultsDeep(defaults)
          .value();
};

function init(customizationsEnabled) {
  const settings = _.assign({}, win.zESettings);

  // for backwards compatibility with authenticate
  if (settings.authenticate) {
    if (!settings.webWidget) {
      settings.webWidget = {};
    }
    settings.webWidget.authenticate = settings.authenticate;
  }

  webWidgetCustomizations = customizationsEnabled;
  webWidgetStore = initStore(settings.webWidget, optionWhitelist.webWidget, webWidgetStoreDefaults);
  ipmStore = initStore(settings.ipm, optionWhitelist.ipm, ipmStoreDefaults);
}

function get(path, store = 'webWidget') {
  // TODO: Remove this check when web widget customizations are out of beta.
  if (customizationsWhitelist.indexOf(path) > -1 &&
      !webWidgetCustomizations) {
    return _.get(webWidgetStoreDefaults, path, null);
  }

  return store === 'webWidget' ? _.get(webWidgetStore, path, null)
                               : _.get(ipmStore, path, null);
}

function getTranslations() {
  const translations = {
    launcherLabel: webWidgetStore.launcher.label,
    launcherChatLabel: webWidgetStore.launcher.chatLabel,
    helpCenterTitle: webWidgetStore.helpCenter.title,
    helpCenterMessageButton: webWidgetStore.helpCenter.messageButton,
    helpCenterChatButton: webWidgetStore.helpCenter.chatButton,
    contactFormTitle: webWidgetStore.contactForm.title
  };

  return webWidgetCustomizations
       ? _.omitBy(translations, _.isUndefined)
       : null;
}

function getTrackSettings() {
  const widgetSettings = _.omit(webWidgetStore, 'margin', 'viaId', 'authenticate');

  return {
    webWidget: widgetSettings,
    ipm: ipmStore
  };
}

export const settings = {
  init: init,
  get: get,
  getTranslations,
  getTrackSettings
};

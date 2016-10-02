import _ from 'lodash';

import { win } from 'utility/globals';
import { objectDifference } from 'utility/utils';

const optionWhitelist = {
  webWidget: [
    'authenticate',
    'channelChoice',
    'chat.suppress',
    'color',
    'contactForm.subject',
    'contactForm.attachments',
    'contactForm.suppress',
    'contactForm.title',
    'helpCenter.chatButton',
    'helpCenter.messageButton',
    'helpCenter.originalArticleButton',
    'helpCenter.suppress',
    'helpCenter.title',
    'helpCenter.localeFallbacks',
    'helpCenter.filter',
    'launcher.chatLabel',
    'launcher.label',
    'offset.vertical',
    'offset.horizontal',
    'zIndex',
    'channelChoice',
    'position.vertical',
    'position.horizontal'
  ],
  ipm: [
    'offset.vertical',
    'offset.horizontal'
  ]
};
const customizationsWhitelist = [
  'channelChoice',
  'helpCenter.localeFallbacks'
];
const webWidgetStoreDefaults = {
  contactForm: {
    subject: false,
    attachments: true,
    suppress: false
  },
  channelChoice: false,
  helpCenter: {
    originalArticleButton: true,
    localeFallbacks: [],
    suppress: false
  },
  chat: {
    suppress: false
  },
  launcher: {},
  margin: 15,
  offset: {
    horizontal: 0,
    vertical: 0
  },
  viaId: 48,
  color: {
    theme: '#78A300'
  },
  zIndex: 999999
};
const ipmStoreDefaults = {
  offset: {
    horizontal: 0,
    vertical: 0
  }
};
const maxLocaleFallbacks = 3;
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

function init() {
  const settings = _.assign({}, win.zESettings);

  // for backwards compatibility with authenticate.
  if (settings.authenticate) {
    if (!settings.webWidget) {
      settings.webWidget = {};
    }
    settings.webWidget.authenticate = settings.authenticate;
  }

  webWidgetStore = initStore(settings.webWidget, optionWhitelist.webWidget, webWidgetStoreDefaults);
  ipmStore = initStore(settings.ipm, optionWhitelist.ipm, ipmStoreDefaults);

  // Limit number of fallback locales.
  webWidgetStore.helpCenter.localeFallbacks = _.take(webWidgetStore.helpCenter.localeFallbacks,
                                                     maxLocaleFallbacks);
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
  const blacklist = ['margin', 'viaId'];
  const userSettings = _.omit(webWidgetStore, blacklist);
  const defaults = _.omit(webWidgetStoreDefaults, blacklist);
  const widgetSettings = objectDifference(userSettings, defaults);
  const ipmSettings = objectDifference(ipmStore, ipmStoreDefaults);

  if (widgetSettings.authenticate) {
    widgetSettings.authenticate = true;
  }

  return _.omitBy({
    webWidget: widgetSettings,
    ipm: ipmSettings
  }, _.isEmpty);
}

function enableCustomizations() {
  webWidgetCustomizations = true;
}

export const settings = {
  init: init,
  get: get,
  getTranslations,
  getTrackSettings,
  enableCustomizations
};

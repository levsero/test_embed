import _ from 'lodash';

import { win } from 'utility/globals';

const optionWhitelist = {
  webWidget: [
    'authenticate',
    'chat.suppress',
    'color',
    'contactForm.attachments',
    'contactForm.suppress',
    'contactForm.title',
    'helpCenter.chatButton',
    'helpCenter.messageButton',
    'helpCenter.originalArticleButton',
    'helpCenter.suppress',
    'helpCenter.title',
    'helpCenter.localeFallbacks',
    'launcher.chatLabel',
    'launcher.label',
    'offset',
    'channelChoice'
  ],
  ipm: [
    'offset'
  ]
};
const customizationsWhitelist = [
  'offset',
  'color.theme',
  'helpCenter.originalArticleButton',
  'contactForm.suppress',
  'chat.suppress',
  'helpCenter.suppress',
  'helpCenter.localeFallbacks'
];
const webWidgetStoreDefaults = {
  contactForm: {
    attachments: true
  },
  channelChoice: false,
  helpCenter: {
    originalArticleButton: true,
    localeFallbacks: []
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
  }
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
  const widgetSettings = _.omit(webWidgetStore, 'margin', 'viaId', 'authenticate');

  return {
    webWidget: widgetSettings,
    ipm: ipmStore
  };
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

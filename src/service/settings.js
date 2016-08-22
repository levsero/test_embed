import _ from 'lodash';

import { win } from 'utility/globals';

const optionWhitelist = {
  webWidget: [
    'authenticate',
    'chat.suppressed',
    'color',
    'contactForm.attachments',
    'contactForm.title',
    'helpCenter.chatButton',
    'helpCenter.messageButton',
    'helpCenter.originalArticleButton',
    'helpCenter.suppressed',
    'helpCenter.title',
    'launcher.chatLabel',
    'launcher.label',
    'offset'
  ],
  ipm: [
    'offset'
  ]
};
let webWidgetStore = {
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
let ipmStore = {
  offset: {
    horizontal: 0,
    vertical: 0
  }
};

const initStore = (settings, store, options) => {
  if (_.isEmpty(settings)) return;

  let whiteListedParams = {};

  _.forEach(options, (option) => {
    if (_.has(settings, option)) {
      _.set(whiteListedParams, option, _.get(settings, option, null));
    }
  });

  _.merge(store, whiteListedParams);
};

function init() {
  const settings = _.assign({}, win.zESettings);

  if (_.isEmpty(settings)) return;

  // for backwards compatibility with authenticate
  if (settings.authenticate) {
    if (!settings.webWidget) {
      settings.webWidget = {};
    }
    settings.webWidget.authenticate = settings.authenticate;
  }

  initStore(settings.webWidget, webWidgetStore, optionWhitelist.webWidget);
  initStore(settings.ipm, ipmStore, optionWhitelist.ipm);
}

function get(path, store = 'webWidget') {
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

  return _.omitBy(translations, _.isUndefined);
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

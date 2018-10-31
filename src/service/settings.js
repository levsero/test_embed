import _ from 'lodash';

import { win } from 'utility/globals';
import { objectDifference } from 'utility/utils';
import { updateSettingsChatSuppress,
  updateSettings } from 'src/redux/modules/settings';

const optionWhitelist = {
  webWidget: [
    'authenticate',
    'authenticate.support',
    'authenticate.chat',
    'contactOptions.enabled',
    'contactOptions.contactButton',
    'contactOptions.chatLabelOnline',
    'contactOptions.chatLabelOffline',
    'contactOptions.contactFormLabel',
    'chat.concierge.avatarPath',
    'chat.departments.enabled',
    'chat.suppress',
    'chat.departments.select',
    'chat.mobile.notifications.disable',
    'chat.prechatForm.departmentLabel',
    'chat.title',
    'chat.prechatForm.greeting',
    'chat.offlineForm.greeting',
    'chat.concierge.title',
    'chat.concierge.name',
    'color.theme',
    'color.button',
    'color.header',
    'color.launcher',
    'color.launcherText',
    'color.articleLinks',
    'color.resultLists',
    'contactForm.attachments',
    'contactForm.fields',
    'contactForm.selectTicketForm',
    'contactForm.subject',
    'contactForm.suppress',
    'contactForm.tags',
    'contactForm.ticketForms',
    'contactForm.title',
    'helpCenter.chatButton',
    'helpCenter.filter',
    'helpCenter.localeFallbacks',
    'helpCenter.messageButton',
    'helpCenter.originalArticleButton',
    'helpCenter.searchPlaceholder',
    'helpCenter.suppress',
    'helpCenter.title',
    'launcher.chatLabel',
    'launcher.label',
    'offset.horizontal',
    'offset.vertical',
    'offset.mobile.horizontal',
    'offset.mobile.vertical',
    'position.horizontal',
    'position.vertical',
    'talk.nickname',
    'talk.suppress',
    'zIndex'
  ]
};
const customizationsWhitelist = [
  'helpCenter.localeFallbacks'
];
const webWidgetStoreDefaults = {
  contactForm: {
    attachments: true,
    fields: [],
    subject: false,
    suppress: false,
    tags: [],
    ticketForms: []
  },
  contactOptions: { enabled: false },
  helpCenter: {
    originalArticleButton: true,
    localeFallbacks: [],
    suppress: false
  },
  chat: {
    concierge: {
      avatarPath: null
    },
    departments: {
      enabled: [],
      select: ''
    },
    suppress: false,
    mobile: {
      notifications: {
        disable: false
      }
    }
  },
  launcher: {},
  margin: 8,
  offset: {
    horizontal: 0,
    vertical: 0,
    mobile: {
      horizontal: 0,
      vertical: 0
    }
  },
  talk: {
    suppress: false
  },
  viaId: 48,
  zIndex: 999999
};
const baseDefaults = {
  errorReporting: true,
  analytics: true
};
const maxLocaleFallbacks = 3;
let settingsStore = {};
let webWidgetStore = {};
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

function init(reduxStore = { dispatch: () => {} }) {
  settingsStore = _.assign({}, baseDefaults, win.zESettings);

  // for backwards compatibility with authenticate.
  if (settingsStore.authenticate) {
    if (!settingsStore.webWidget) {
      settingsStore.webWidget = {};
    }
    settingsStore.webWidget.authenticate = settingsStore.authenticate;
  }

  webWidgetStore = initStore(settingsStore.webWidget, optionWhitelist.webWidget, webWidgetStoreDefaults);

  // Limit number of fallback locales.
  webWidgetStore.helpCenter.localeFallbacks = _.take(webWidgetStore.helpCenter.localeFallbacks,
    maxLocaleFallbacks);

  reduxStore.dispatch(updateSettingsChatSuppress(webWidgetStore.chat.suppress));
  reduxStore.dispatch(updateSettings({
    ...settingsStore,
    webWidget: webWidgetStore
  }));
}

function get(path) {
  // TODO: Remove this check when web widget customizations are out of beta.
  if (customizationsWhitelist.indexOf(path) > -1 &&
      !webWidgetCustomizations) {
    return _.get(webWidgetStoreDefaults, path, null);
  }

  return _.get(webWidgetStore, path, null);
}

function getTranslations() {
  const translations = {
    contactFormSelectTicketForm: webWidgetStore.contactForm.selectTicketForm,
    contactFormTitle: webWidgetStore.contactForm.title,
    helpCenterChatButton: webWidgetStore.helpCenter.chatButton,
    helpCenterMessageButton: webWidgetStore.helpCenter.messageButton,
    helpCenterContactButton: webWidgetStore.contactOptions.contactButton,
    helpCenterSearchPlaceholder: webWidgetStore.helpCenter.searchPlaceholder,
    helpCenterTitle: webWidgetStore.helpCenter.title,
    launcherChatLabel: webWidgetStore.launcher.chatLabel,
    launcherLabel: webWidgetStore.launcher.label,
    contactOptionsChatLabelOnline: webWidgetStore.contactOptions.chatLabelOnline,
    contactOptionsChatLabelOffline: webWidgetStore.contactOptions.chatLabelOffline,
    contactOptionsContactFormLabel: webWidgetStore.contactOptions.contactFormLabel
  };

  return _.omitBy(translations, _.isUndefined);
}

function getTrackSettings() {
  const blacklist = ['margin', 'viaId'];
  const userSettings = _.omit(webWidgetStore, blacklist);
  const defaults = _.omit(webWidgetStoreDefaults, blacklist);
  const widgetSettings = objectDifference(userSettings, defaults);

  if (widgetSettings.authenticate) {
    widgetSettings.authenticate = true;
  }

  return _.omitBy({
    webWidget: widgetSettings
  }, _.isEmpty);
}

function getSupportAuthSettings() {
  let authSetting = get('authenticate.support');

  if (authSetting && authSetting.jwt) {
    return authSetting;
  }

  // If webWidget.authenticate.support setting is not valid.
  // Fallback to original webWidget.authenticate setting
  authSetting = get('authenticate');

  return (authSetting && authSetting.jwt) ? authSetting : null;
}

function getChatAuthSettings() {
  const authSetting = get('authenticate.chat');

  return (authSetting && authSetting.jwtFn) ? authSetting : null;
}

function getErrorReportingEnabled() {
  return Boolean(settingsStore.errorReporting);
}

function enableCustomizations() {
  webWidgetCustomizations = true;
}

export const settings = {
  init,
  get,
  getTranslations,
  getTrackSettings,
  getSupportAuthSettings,
  getChatAuthSettings,
  getErrorReportingEnabled,
  enableCustomizations
};

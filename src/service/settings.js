import _ from 'lodash';

import { win } from 'utility/globals';
import { objectDifference } from 'utility/utils';
import { updateSettingsChatSuppress } from 'src/redux/modules/settings';

const optionWhitelist = {
  webWidget: [
    'authenticate',
    'contactOptions.enabled',
    'contactOptions.contactButton',
    'contactOptions.chatLabelOnline',
    'contactOptions.chatLabelOffline',
    'contactOptions.contactFormLabel',
    'chat.suppress',
    'color',
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
    'helpCenter.viewMore',
    'launcher.chatLabel',
    'launcher.label',
    'offset.horizontal',
    'offset.vertical',
    'position.horizontal',
    'position.vertical',
    'talk.keyword',
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
    suppress: false,
    viewMore: true
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
  talk: {
    suppress: false
  },
  viaId: 48,
  zIndex: 999999
};
const maxLocaleFallbacks = 3;
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
  const settings = _.assign({}, win.zESettings);

  // for backwards compatibility with authenticate.
  if (settings.authenticate) {
    if (!settings.webWidget) {
      settings.webWidget = {};
    }
    settings.webWidget.authenticate = settings.authenticate;
  }

  webWidgetStore = initStore(settings.webWidget, optionWhitelist.webWidget, webWidgetStoreDefaults);

  // Limit number of fallback locales.
  webWidgetStore.helpCenter.localeFallbacks = _.take(webWidgetStore.helpCenter.localeFallbacks,
                                                     maxLocaleFallbacks);

  reduxStore.dispatch(updateSettingsChatSuppress(webWidgetStore.chat.suppress));
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

function enableCustomizations() {
  webWidgetCustomizations = true;
}

export const settings = {
  init,
  get,
  getTranslations,
  getTrackSettings,
  enableCustomizations
};

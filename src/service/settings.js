import _ from 'lodash';

import { win } from 'utility/globals';
import { objectDifference } from 'utility/utils';
import { updateSettings } from 'src/redux/modules/settings';
import { mediator } from 'service/mediator';

const optionAllowList = {
  webWidget: [
    'answerBot.search.labels',
    'answerBot.title',
    'answerBot.avatar.name',
    'answerBot.avatar.url',
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
    'chat.notifications.mobile.disable',
    'chat.prechatForm.departmentLabel',
    'chat.title',
    'chat.prechatForm.greeting',
    'chat.offlineForm.greeting',
    'chat.connectionSuppress',
    'chat.connectOnDemand',
    'chat.concierge.title',
    'chat.concierge.name',
    'chat.hideWhenOffline',
    'chat.tags',
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
    'navigation',
    'launcher.chatLabel',
    'launcher.label',
    'launcher.badge.layout',
    'launcher.badge.image',
    'launcher.badge.label',
    'offset.horizontal',
    'offset.vertical',
    'offset.mobile.horizontal',
    'offset.mobile.vertical',
    'position.horizontal',
    'position.vertical',
    'talk.nickname',
    'talk.suppress',
    'talk.title',
    'zIndex'
  ]
};
const customizationsAllowList = [
  'helpCenter.localeFallbacks'
];
const webWidgetStoreDefaults = {
  answerBot: {
    avatar: {
      url: '',
      name: {}
    },
    title: {},
    search: {
      labels: []
    }
  },
  contactForm: {
    fields: [],
    ticketForms: []
  },
  helpCenter: {},
  contactOptions: {
    enabled: false
  },
  chat: {
    concierge: {
      avatarPath: null
    },
    departments: {
      enabled: null,
      select: ''
    },
    suppress: false,
    connectionSuppress: false,
    notifications: {
      mobile: {
        disable: false
      }
    },
    tags: []
  },
  launcher: { },
  margin: 8,
  talk: {
    suppress: false,
    nickname: null,
    title: {}
  },
  viaId: 48,
  viaIdAnswerBot: 67
};
const baseDefaults = {
  errorReporting: true,
  analytics: true,
  cookies: true
};
let settingsStore = {};
let webWidgetStore = {};
let webWidgetCustomizations = false;

const initStore = (settings, options, defaults) => {
  const store = options.reduce((result, option) => {
    if (_.has(settings, option)) {
      _.set(result, option, _.get(settings, option, null));
    }

    return result;
  }, {});

  return _.defaultsDeep(store, defaults);
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

  webWidgetStore = initStore(settingsStore.webWidget, optionAllowList.webWidget, webWidgetStoreDefaults);

  reduxStore.dispatch(updateSettings({
    webWidget: {
      ...webWidgetStore,
      ...settingsStore
    }
  }));
}

function get(path) {
  // TODO: Remove this check when web widget customizations are out of beta.
  if (customizationsAllowList.indexOf(path) > -1 &&
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
    helpCenterSearchPlaceholder: webWidgetStore.helpCenter.searchPlaceholder,
    helpCenterTitle: webWidgetStore.helpCenter.title,
    launcherChatLabel: webWidgetStore.launcher.chatLabel,
    launcherLabel: webWidgetStore.launcher.label
  };

  return _.omitBy(translations, _.isUndefined);
}

function getTrackSettings() {
  const denyList = ['margin', 'viaId', 'viaIdAnswerBot'];
  const userSettings = _.omit(webWidgetStore, denyList);
  const defaults = _.omit(webWidgetStoreDefaults, denyList);
  const widgetSettings = objectDifference(userSettings, defaults);

  if (widgetSettings.authenticate) {
    const authSettings = widgetSettings.authenticate;

    widgetSettings.authenticate = {
      helpCenter: !!authSettings.jwt || !!_.get(authSettings, 'support.jwt'),
      chat: !!(authSettings.chat && authSettings.chat.jwtFn)
    };
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

// Only used in testing
function disableCustomizations() {
  webWidgetCustomizations = false;
}

function updateSettingsLegacy(newSettings, callback=() => {}) {
  _.merge(webWidgetStore, newSettings);
  callback();
  mediator.channel.broadcast('.onUpdateSettings');
}

export const settings = {
  init,
  get,
  getTranslations,
  getTrackSettings,
  getSupportAuthSettings,
  getChatAuthSettings,
  getErrorReportingEnabled,
  enableCustomizations,
  updateSettingsLegacy,
  disableCustomizations
};

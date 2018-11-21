import _ from 'lodash';
import { getSettingsChatTags } from 'src/redux/modules/settings/settings-selectors';
import { i18n } from 'service/i18n';
import {
  updateSettingsApi,
  updateSettingsLegacyApi,
  setLocaleApi
} from 'src/service/api/apis';

export const setPositionApi = (position) => {
  const mapPositions = {
    'b': 'bottom',
    't': 'top',
    'm': null,
    'r': 'right',
    'l': 'left'
  };
  const verticalVal = mapPositions[position[0]];
  const horizontalVal = mapPositions[position[1]];

  if (horizontalVal === 'left' || horizontalVal === 'right') {
    updateSettingsLegacy('position.horizontal', horizontalVal);
  }

  if (verticalVal === 'top' || verticalVal === 'bottom') {
    updateSettingsLegacy('position.vertical', verticalVal);
  }
};

export const setOffsetApi = {
  setOffsetVertical: (dist) => updateSettingsLegacy('offset.vertical', dist),
  setOffsetHorizontal: (dist) => updateSettingsLegacy('offset.horizontal', dist)
};

export const setOffsetMobileApi = {
  setOffsetVerticalMobile: (dist) => updateSettingsLegacy('offset.mobile.vertical', dist),
  setOffsetHorizontalMobile: (dist) => updateSettingsLegacy('offset.mobile.horizontal', dist)
};

export const setGreetingsApi = (greetings) => {
  const onlineGreeting = _.get(greetings, 'online');
  const offlineGreeting = _.get(greetings, 'offline');

  const callback = () => {
    i18n.setCustomTranslations();
  };

  if (_.isString(onlineGreeting)) {
    updateSettingsLegacy('launcher.chatLabel.*', onlineGreeting, callback);
  }

  if (_.isString(offlineGreeting)) {
    updateSettingsLegacy('launcher.label.*', offlineGreeting, callback);
  }
};

export const setProfileCardConfigApi = (store) => (settings) => {
  const newSettings = {
    webWidget: {
      chat: {
        profileCard: {}
      }
    }
  };
  const {
    profileCard
  } = newSettings.webWidget.chat;

  if (_.isBoolean(settings.avatar)) {
    profileCard.avatar = settings.avatar;
  }
  if (_.isBoolean(settings.title)) {
    profileCard.title = settings.title;
  }
  if (_.isBoolean(settings.rating)) {
    profileCard.rating = settings.rating;
  }

  updateSettingsApi(store, newSettings);
};

export const removeTagsApi = (store) => (...tagsToRemove) => {
  const oldTags = getSettingsChatTags(store.getState());
  const newTags = oldTags.filter((oldTag) => {
    return !_.includes(tagsToRemove, oldTag);
  });

  updateSettings(store, 'webWidget.chat.tags', newTags);
};

export const addTagsApi = (store) => (...tagsToAdd) => {
  const oldTags = getSettingsChatTags(store.getState());

  updateSettings(store, 'webWidget.chat.tags', [...oldTags, ...tagsToAdd]);
};

export const setColorTheme = (color) => {
  if (!_.isString(color)) return;

  updateSettingsLegacy('color.theme', color);
};

export const setApi = (store, win, options) => {
  if (options.name) {
    win.$zopim.livechat.setName(options.name);
  }

  if (options.email) {
    win.$zopim.livechat.setEmail(options.email);
  }

  if (options.language) {
    setLocaleApi(store, options.language);
  }
};

export const updateSettingsLegacy = (s, val, callback = () => {}) => {
  const newSettings = _.set({}, s, val);

  updateSettingsLegacyApi(newSettings, callback);
};

export const updateSettings = (store, s, val) => {
  const newSettings = _.set({}, s, val);

  updateSettingsApi(store, newSettings);
};

export function zopimExistsOnPage(win) {
  return !!win.$zopim;
}
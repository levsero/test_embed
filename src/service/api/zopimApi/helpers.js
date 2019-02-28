import _ from 'lodash';
import { getSettingsChatTags } from 'src/redux/modules/settings/settings-selectors';
import {
  updateSettingsApi,
  updateSettingsLegacyApi
} from 'src/service/api/apis';
import {
  handleOnApiCalled,
  badgeHideReceived,
  badgeShowReceived
} from 'src/redux/modules/base';
import { SDK_ACCOUNT_STATUS, SDK_DEPARTMENT_UPDATE } from 'src/redux/modules/chat/chat-action-types';
import { getChatStatus } from 'src/redux/modules/chat/chat-selectors';

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

export const setGreetingsApi = (store, greetings) => {
  const onlineGreeting = _.get(greetings, 'online');
  const offlineGreeting = _.get(greetings, 'offline');

  if (_.isString(onlineGreeting)) {
    updateSettings(store, 'webWidget.launcher.chatLabel.*', onlineGreeting);
  }

  if (_.isString(offlineGreeting)) {
    updateSettings(store, 'webWidget.launcher.label.*', offlineGreeting);
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

const upperCaseFirstChar = (str) => {
  str += '';
  return str.charAt(0).toUpperCase() + str.substring(1);
};

const supportedSetters = [
  'color',
  'name',
  'email',
  'language',
  'phone',
  'status',
  'greetings',
  'disableGoogleAnalytics',
  'onConnected',
  'onChatStart',
  'onChatEnd',
  'onStatus',
  'onUnreadMsgs'
];

export const setApi = (win, options) => {
  for (let name in options) {
    if (_.includes(supportedSetters, name)) {
      const methodName = 'set' + upperCaseFirstChar(name);
      const arg = options[name];

      win.$zopim.livechat[methodName](arg);
    }
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

export const setOnStatusApi = (store, callback) => {
  if (_.isFunction(callback)) {
    store.dispatch(handleOnApiCalled(SDK_ACCOUNT_STATUS, [getChatStatus], callback));

    store.dispatch(handleOnApiCalled(SDK_DEPARTMENT_UPDATE, [getChatStatus], _.debounce(callback, 0)));
  }
};

export const showBadgeApi = (store) => {
  store.dispatch(badgeShowReceived());
};

export const hideBadgeApi = (store) => {
  store.dispatch(badgeHideReceived());
};

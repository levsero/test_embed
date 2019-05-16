import _ from 'lodash';
import { getSettingsChatTags } from 'src/redux/modules/settings/settings-selectors';
import { updateSettingsApi } from 'src/service/api/apis';
import { getChatStatus } from 'src/redux/modules/chat/chat-selectors';
import {
  badgeHideReceived,
  badgeShowReceived
} from 'src/redux/modules/base';
import * as callbacks from 'service/api/callbacks';
import { API_ON_CHAT_STATUS_NAME, API_ON_CHAT_DEPARTMENT_STATUS } from 'constants/api';

import tracker from 'service/logging/tracker';

export const setPositionApi = (store) => (position) => {
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
    updateSettings(store, 'webWidget.position.horizontal', horizontalVal);
  }

  if (verticalVal === 'top' || verticalVal === 'bottom') {
    updateSettings(store, 'webWidget.position.vertical', verticalVal);
  }
};

export const setOffsetApi = (store) => {
  return {
    setOffsetVertical: (dist) => updateSettings(store, 'webWidget.offset.vertical', dist),
    setOffsetHorizontal: (dist) => updateSettings(store, 'webWidget.offset.horizontal', dist)
  };
};

export const setOffsetMobileApi = (store) => {
  return {
    setOffsetVerticalMobile: (dist) => updateSettings(store, 'webWidget.offset.mobile.vertical', dist),
    setOffsetHorizontalMobile: (dist) => updateSettings(store, 'webWidget.offset.mobile.horizontal', dist)
  };
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

export const addTagsApi = (store) => (...args) => {
  const oldTags = getSettingsChatTags(store.getState());
  const tags = _.flattenDeep(args);

  const tagsToAdd = tags.reduce((newTags, tag) => {
    if (_.isEmpty(tag)) return newTags;

    tag.split(',').forEach((subTag) => {
      const newTag = subTag.trim();

      if (!_.isEmpty(newTag)) {
        newTags.push(newTag);
      }
    });

    return newTags;
  }, []);

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

export const updateSettings = (store, s, val) => {
  const newSettings = _.set({}, s, val);

  updateSettingsApi(store, newSettings);
};

export function zopimExistsOnPage(win) {
  return !!win.$zopim;
}

export const setOnStatusApi = (store, callback) => {
  if (_.isFunction(callback)) {
    const wrappedCallbackWithArgs = () => {
      const chatStatus = getChatStatus(store.getState());

      callback(chatStatus);
    };

    callbacks.registerCallback(wrappedCallbackWithArgs, API_ON_CHAT_STATUS_NAME);
    callbacks.registerCallback(_.debounce(wrappedCallbackWithArgs, 0), API_ON_CHAT_DEPARTMENT_STATUS);
  }
};

export const showBadgeApi = (store) => {
  store.dispatch(badgeShowReceived());
};

export const hideBadgeApi = (store) => {
  store.dispatch(badgeHideReceived());
};

export function trackZopimApis(win) {
  tracker.addToMethod(win.$zopim.livechat, 'getName', '$zopim.livechat.getName');
  tracker.addToMethod(win.$zopim.livechat, 'getEmail', '$zopim.livechat.getEmail');
  tracker.addToMethod(win.$zopim.livechat, 'getPhone', '$zopim.livechat.getPhone');
  tracker.addToMethod(win.$zopim.livechat, 'appendNotes', '$zopim.livechat.appendNotes');
  tracker.addToMethod(win.$zopim.livechat, 'setNotes', '$zopim.livechat.setNotes');
  tracker.addToMethod(win.$zopim.livechat.window, 'setSize', '$zopim.livechat.window.setSize');
  tracker.addToMethod(win.$zopim.livechat.window, 'show', '$zopim.livechat.window.show');
  tracker.addToMethod(win.$zopim.livechat.theme, 'setFontConfig', '$zopim.livechat.theme.setFontConfig');
  tracker.addTo(win.$zopim.livechat.cookieLaw, '$zopim.livechat.cookieLaw');
}

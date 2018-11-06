import _ from 'lodash';
import { updateSettingsChatSuppress } from 'src/redux/modules/settings';
import { getSettingsChatTags } from 'src/redux/modules/settings/settings-selectors';
import {
  endChatApi,
  sendChatMsgApi,
  openApi,
  closeApi,
  toggleApi,
  updateSettingsApi,
  updateSettingsLegacyApi,
  hideApi,
  showApi,
  displayApi,
  isChattingApi,
  prefill,
  updatePathApi,
  logoutApi,
  onApiObj,
  getDepartmentApi,
  getAllDepartmentsApi
} from 'src/service/api/apis';
import {
  API_ON_CHAT_CONNECTED_NAME,
  API_ON_CHAT_START_NAME,
  API_ON_CHAT_END_NAME,
  API_ON_CHAT_STATUS_NAME,
  API_ON_CHAT_UNREAD_MESSAGES_NAME,
  API_ON_CLOSE_NAME,
  API_ON_OPEN_NAME
} from 'constants/api';

import { i18n } from 'service/i18n';

function zopimExistsOnPage(win) {
  return !!win.$zopim;
}

function setupZopimQueue(win) {
  // To enable $zopim api calls to work we need to define the queue callback.
  // When we inject the snippet we remove the queue method and just inject
  // the script tag.
  if (!zopimExistsOnPage(win)) {
    let $zopim;

    $zopim = win.$zopim = (callback) => {
      if ($zopim.flushed) {
        callback();
      } else {
        $zopim._.push(callback);
      }
    };

    $zopim.set = (callback) => {
      $zopim.set._.push(callback);
    };
    $zopim._ = [];
    $zopim.set._ = [];
    $zopim._setByWW = true;
  }
}

function handleZopimQueue(win) {
  if (!_.get(win.$zopim, '_setByWW', false))
    return;
  _.forEach(_.get(win.$zopim, '_', []), (method) => {
    try {
      method();
    } catch (e) {
      const err = new Error('An error occurred in your use of the $zopim Widget API');

      err.special = true;
      throw err;
    }
  });
  _.set(win.$zopim, 'flushed', true);
}

const updateSettings = (store, s, val) => {
  const newSettings = _.set({}, s, val);

  updateSettingsApi(store, newSettings);
};

const updateSettingsLegacy = (s, val, callback=() => {}) => {
  const newSettings = _.set({}, s, val);

  updateSettingsLegacyApi(newSettings, callback);
};

const setPositionApi = (position) => {
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

const setOffsetApi = {
  setOffsetVertical: (dist) => updateSettingsLegacy('offset.vertical', dist),
  setOffsetHorizontal: (dist) => updateSettingsLegacy('offset.horizontal', dist)
};

const setOffsetMobileApi = {
  setOffsetVerticalMobile: (dist) => updateSettingsLegacy('offset.mobile.vertical', dist),
  setOffsetHorizontalMobile: (dist) => updateSettingsLegacy('offset.mobile.horizontal', dist)
};

const setGreetingsApi = (greetings) => {
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

const setProfileCardConfigApi = (store) => (settings) => {
  const newSettings = {
    webWidget: {
      chat: {
        profileCard: {}
      }
    }
  };
  const { profileCard } = newSettings.webWidget.chat;

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

const removeTagsApi = (store) => (...tagsToRemove) => {
  const oldTags = getSettingsChatTags(store.getState());
  const newTags = oldTags.filter((oldTag) => {
    return !_.includes(tagsToRemove, oldTag);
  });

  updateSettings(store, 'webWidget.chat.tags', newTags);
};

const addTagsApi = (store) => (...tagsToAdd) => {
  const oldTags = getSettingsChatTags(store.getState());

  updateSettings(store, 'webWidget.chat.tags', [...oldTags, ...tagsToAdd]);
};

const setColorTheme = (color) => {
  if (!_.isString(color)) return;

  updateSettingsLegacy('color.theme', color);
};

function setUpZopimApiMethods(win, store) {
  win.$zopim = win.$zopim || {};

  if (_.isUndefined(win.$zopim.livechat)) {
    const onApis = onApiObj();

    win.$zopim.livechat = {
      window: {
        toggle: () => toggleApi(store),
        hide: () => hideApi(store),
        show: () => openApi(store),
        getDisplay: () => displayApi(store),
        onHide: (callback) => onApis[API_ON_CLOSE_NAME](store, callback),
        onShow: (callback) => onApis[API_ON_OPEN_NAME](store, callback),
        setTitle: (title) => updateSettings(store, 'webWidget.chat.title.*', title),
        setColor: (color) => setColorTheme(color),
        setPosition: setPositionApi,
        ...setOffsetApi
      },
      prechatForm: {
        setGreetings: (msg) => updateSettings(store, 'webWidget.chat.prechatForm.greeting.*', msg)
      },
      offlineForm: {
        setGreetings: (msg) => updateSettings(store, 'webWidget.chat.offlineForm.greeting.*', msg)
      },
      button: {
        hide: () => hideApi(store),
        show: () => {
          showApi(store);
          closeApi(store);
        },
        setHideWhenOffline: (bool) => updateSettings(store, 'webWidget.launcher.setHideWhenChatOffline', bool),
        setPosition: setPositionApi,
        setPositionMobile: setPositionApi,
        setColor: (color) => updateSettingsLegacy('color.launcher', color),
        ...setOffsetApi,
        ...setOffsetMobileApi
      },
      theme: {
        setColor: (color) => setColorTheme(color),
        setColors: (options) => {
          if (!options.primary) return;

          setColorTheme(options.primary);
        },
        reload: () => {},
        setProfileCardConfig: setProfileCardConfigApi(store)
      },
      mobileNotifications: {
        setDisabled: (bool) => updateSettings(store, 'webWidget.chat.notifications.mobile.disable', bool)
      },
      departments: {
        setLabel: (label) => updateSettings(store, 'webWidget.chat.prechatForm.departmentLabel.*', label),
        getDepartment: (id) => getDepartmentApi(store, id),
        getAllDepartments: () => getAllDepartmentsApi(store),
        filter: (...deps) => updateSettings(store, 'webWidget.chat.departments.enabled', [...deps]),
        setVisitorDepartment: (nameOrId) => updateSettings(store, 'webWidget.chat.departments.select', nameOrId),
        clearVisitorDepartment: () => updateSettings(store, 'webWidget.chat.departments.select', ''),
      },
      concierge: {
        setAvatar: (path) => updateSettings(store, 'webWidget.chat.concierge.avatarPath', path),
        setName: (name) => updateSettings(store, 'webWidget.chat.concierge.name', name),
        setTitle: (title) => updateSettings(store, 'webWidget.chat.concierge.title.*', title)
      },
      setColor: (color) => updateSettingsLegacy('color.theme', color),
      hideAll: () => hideApi(store),
      set: (newSettings) => updateSettingsApi(store, newSettings),
      isChatting: () => isChattingApi(store),
      say: (msg) => sendChatMsgApi(store, msg),
      endChat: () => endChatApi(store),
      addTags: addTagsApi(store),
      removeTags: removeTagsApi(store),
      setName: (newName) => prefill(store, { name: { value: newName } }),
      setEmail: (newEmail) => prefill(store, { email: { value: newEmail } }),
      setPhone: (newPhone) => prefill(store, { phone: { value: newPhone } }),
      sendVisitorPath: (page) => updatePathApi(store, page),
      clearAll: () => logoutApi(store),
      setStatus: (status) => { store.dispatch(updateSettingsChatSuppress(status !== 'online')); },
      setDisableGoogleAnalytics: (bool) => updateSettings(store, 'webWidget.analytics', !bool),
      setGreetings: setGreetingsApi,
      setOnConnected: (callback) => onApis.chat[API_ON_CHAT_CONNECTED_NAME](store, callback),
      setOnChatStart: (callback) => onApis.chat[API_ON_CHAT_START_NAME](store, callback),
      setOnChatEnd: (callback) => onApis.chat[API_ON_CHAT_END_NAME](store, callback),
      setOnStatus: (callback) => onApis.chat[API_ON_CHAT_STATUS_NAME](store, callback),
      setOnUnreadMsgs: (callback) => onApis.chat[API_ON_CHAT_UNREAD_MESSAGES_NAME](store, callback)
    };
  }
}

export const zopimApi = {
  setupZopimQueue,
  handleZopimQueue,
  setUpZopimApiMethods
};

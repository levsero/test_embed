import _ from 'lodash';
import {
  API_ON_CHAT_CONNECTED_NAME,
  API_ON_CHAT_START_NAME,
  API_ON_CHAT_END_NAME,
  API_ON_CHAT_STATUS_NAME,
  API_ON_CHAT_UNREAD_MESSAGES_NAME,
  API_ON_CLOSE_NAME,
  API_ON_OPEN_NAME
} from 'constants/api';
import { setStatusForcefully } from 'src/redux/modules/chat';
import {
  endChatApi,
  sendChatMsgApi,
  openApi,
  closeApi,
  toggleApi,
  hideApi,
  showApi,
  displayApi,
  isChattingApi,
  prefill,
  updatePathApi,
  logoutApi,
  onApiObj,
  getDepartmentApi,
  getAllDepartmentsApi,
} from 'src/service/api/apis';
import {
  setPositionApi,
  setColorTheme,
  setOffsetApi,
  updateSettings,
  setOffsetMobileApi,
  updateSettingsLegacy,
  setProfileCardConfigApi,
  setApi,
  addTagsApi,
  removeTagsApi,
  setGreetingsApi,
} from './helpers';
import tracker from 'service/logging/tracker';

export function setUpZopimApiMethods(win, store) {
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
      set: (options) => setApi(store, win, options),
      isChatting: () => isChattingApi(store),
      say: (msg) => sendChatMsgApi(store, msg),
      endChat: () => endChatApi(store),
      addTags: addTagsApi(store),
      removeTags: removeTagsApi(store),
      setName: (newName) => prefill(store, {
        name: {
          value: newName
        }
      }),
      setEmail: (newEmail) => prefill(store, {
        email: {
          value: newEmail
        }
      }),
      setPhone: (newPhone) => prefill(store, {
        phone: {
          value: newPhone
        }
      }),
      sendVisitorPath: (page) => updatePathApi(store, page),
      clearAll: () => logoutApi(store),
      setStatus: (status) => {
        if (status !== 'online' && status !== 'offline') return;

        store.dispatch(setStatusForcefully(status));
      },
      setDisableGoogleAnalytics: (bool) => updateSettings(store, 'webWidget.analytics', !bool),
      setGreetings: setGreetingsApi,
      setOnConnected: (callback) => onApis.chat[API_ON_CHAT_CONNECTED_NAME](store, callback),
      setOnChatStart: (callback) => onApis.chat[API_ON_CHAT_START_NAME](store, callback),
      setOnChatEnd: (callback) => onApis.chat[API_ON_CHAT_END_NAME](store, callback),
      setOnStatus: (callback) => onApis.chat[API_ON_CHAT_STATUS_NAME](store, callback),
      setOnUnreadMsgs: (callback) => onApis.chat[API_ON_CHAT_UNREAD_MESSAGES_NAME](store, callback)
    };

    instrumentZopimApis(win);
  }
}

function instrumentZopimApis(win) {
  tracker.addTo(win.$zopim.livechat.theme, '$zopim.livechat.theme');
  tracker.addTo(win.$zopim.livechat.window, '$zopim.livechat.window');
  tracker.addTo(win.$zopim.livechat.button, '$zopim.livechat.button');
  tracker.addTo(win.$zopim.livechat.departments, '$zopim.livechat.departments');
  tracker.addTo(win.$zopim.livechat.concierge, '$zopim.livechat.concierge');
  tracker.addTo(win.$zopim.livechat.mobileNotifications, '$zopim.livechat.mobileNotifications');
  tracker.addTo(win.$zopim.livechat.prechatForm, '$zopim.livechat.prechatForm');
  tracker.addTo(win.$zopim.livechat.offlineForm, '$zopim.livechat.offlineForm');
  tracker.addTo(win.$zopim.livechat, '$zopim.livechat');
}

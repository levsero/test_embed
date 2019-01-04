import _ from 'lodash';

import {
  handlePrefillReceived,
  logout,
  apiClearForm,
  showRecieved,
  hideRecieved,
  openReceived,
  closeReceived,
  toggleReceived } from 'src/redux/modules/base';
import {
  API_ON_CHAT_STATUS_NAME,
  API_ON_CLOSE_NAME,
  API_ON_OPEN_NAME,
  API_ON_CHAT_CONNECTED_NAME,
  API_ON_CHAT_START_NAME,
  API_ON_CHAT_END_NAME,
  API_ON_CHAT_UNREAD_MESSAGES_NAME,
  API_ON_CHAT_DEPARTMENT_STATUS } from 'constants/api';
import {
  CHAT_CONNECTED,
  END_CHAT_REQUEST_SUCCESS,
  NEW_AGENT_MESSAGE_RECEIVED,
  CHAT_STARTED,
  SDK_ACCOUNT_STATUS,
  SDK_DEPARTMENT_UPDATE } from 'src/redux/modules/chat/chat-action-types';
import { chatLogout, sendVisitorPath, endChat, sendMsg } from 'src/redux/modules/chat';
import { getWidgetDisplayInfo } from 'src/redux/modules/selectors';
import {
  getDepartment,
  getDepartmentsList,
  getIsChatting,
  getNotificationCount,
  getChatStatus,
  getIsPopoutAvailable,
  getZChatVendor } from 'src/redux/modules/chat/chat-selectors';
import { EXECUTE_API_ON_CLOSE_CALLBACK, EXECUTE_API_ON_OPEN_CALLBACK } from 'src/redux/modules/base/base-action-types';
import { updateSettings } from 'src/redux/modules/settings';
import { setContextualSuggestionsManually } from 'src/redux/modules/helpCenter';
import { getSettingsChatPopout } from 'src/redux/modules/settings/settings-selectors';

import { chat as zopimChat } from 'embed/chat/chat';
import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
import { beacon } from 'service/beacon';
import { createChatPopoutWindow } from 'src/util/chat';
import { nameValid, emailValid } from 'utility/utils';

import { handleOnApiCalled } from 'src/redux/modules/base/base-actions';

import { getActiveEmbed } from 'src/redux/modules/base/base-selectors';

export const endChatApi = (reduxStore) => {
  reduxStore.dispatch(endChat());
};

export const sendChatMsgApi = (reduxStore, msg) => {
  const message = (_.isString(msg)) ? msg : '';

  reduxStore.dispatch(sendMsg(message));
};

export const identifyApi = (_reduxStore, user) => {
  const isEmailValid = emailValid(user.email),
    isNameValid = nameValid(user.name);

  if (isEmailValid && isNameValid) {
    beacon.identify(user);
    zopimChat.setUser(user);
  } else if (isEmailValid) {
    console.warn('invalid name passed into zE.identify', user.name); // eslint-disable-line no-console
    zopimChat.setUser(user);
  } else if (isNameValid) {
    console.warn('invalid email passed into zE.identify', user.email); // eslint-disable-line no-console
    zopimChat.setUser(user);
  } else {
    console.warn('invalid params passed into zE.identify', user); // eslint-disable-line no-console
  }
};

export const openApi = (reduxStore) => {
  const state = reduxStore.getState();

  if (getActiveEmbed(state) === 'zopimChat') {
    mediator.channel.broadcast('zopimChat.show');
  } else {
    reduxStore.dispatch(openReceived());
  }
};

export const closeApi = (reduxStore) => {
  const state = reduxStore.getState();

  if (getActiveEmbed(state) === 'zopimChat') {
    mediator.channel.broadcast('zopimChat.hide');
  }

  reduxStore.dispatch(closeReceived());
};

export const toggleApi = (reduxStore) => {
  const state = reduxStore.getState();

  if (getActiveEmbed(state) === 'zopimChat') {
    mediator.channel.broadcast('zopimChat.toggle');
  } else {
    reduxStore.dispatch(toggleReceived());
  }
};

export const setLocaleApi = (_, locale) => {
  i18n.setLocale(locale);
  mediator.channel.broadcast('.onSetLocale');
};

export const updateSettingsApi = (reduxStore, newSettings) => {
  reduxStore.dispatch(updateSettings(newSettings));
};

export const updateSettingsLegacyApi = (newSettings, callback=()=>{}) => {
  settings.updateSettingsLegacy(newSettings, callback);
};

export const logoutApi = (reduxStore) => {
  reduxStore.dispatch(logout());
  mediator.channel.broadcast('.logout');
  reduxStore.dispatch(chatLogout());
};

export const setHelpCenterSuggestionsApi = (reduxStore, options) => {
  const onDone = () => mediator.channel.broadcast('.setHelpCenterSuggestions');

  reduxStore.dispatch(setContextualSuggestionsManually(options, onDone));
};

export const prefill = (reduxStore, payload) => {
  reduxStore.dispatch(handlePrefillReceived(payload));
};

export const hideApi = (reduxStore) => {
  reduxStore.dispatch(hideRecieved());
};

export const showApi = (reduxStore) => {
  reduxStore.dispatch(showRecieved());
};

export const popoutApi = (reduxStore) => {
  const reduxState = reduxStore.getState();

  if (getIsPopoutAvailable(reduxState)) {
    createChatPopoutWindow(
      getSettingsChatPopout(reduxState),
      getZChatVendor(reduxState).getMachineId(),
      i18n.getLocale()
    );
  }
};

export const updatePathApi = (reduxStore, page = {}) => {
  reduxStore.dispatch(sendVisitorPath(page));
};

export const clearFormState = (reduxStore) => {
  reduxStore.dispatch(apiClearForm());
};

export const displayApi = (reduxStore, ...args) => getWidgetDisplayInfo(reduxStore.getState(), ...args);

export const isChattingApi = (reduxStore, ...args) => getIsChatting(reduxStore.getState(), ...args);

export const getDepartmentApi =  (reduxStore, ...args) => getDepartment(reduxStore.getState(), ...args);

export const getAllDepartmentsApi = (reduxStore, ...args) => getDepartmentsList(reduxStore.getState(), ...args);

export const onApiObj = () => {
  const chatEventMap = {
    [API_ON_CHAT_CONNECTED_NAME]: { actionType: CHAT_CONNECTED },
    [API_ON_CHAT_END_NAME]: { actionType: END_CHAT_REQUEST_SUCCESS },
    [API_ON_CHAT_START_NAME]: { actionType: CHAT_STARTED },
    [API_ON_CHAT_STATUS_NAME]: {
      actionType: SDK_ACCOUNT_STATUS,
      selectors: [getChatStatus]
    },
    [API_ON_CHAT_UNREAD_MESSAGES_NAME]: {
      actionType: NEW_AGENT_MESSAGE_RECEIVED,
      selectors: [getNotificationCount]
    },
    [API_ON_CHAT_DEPARTMENT_STATUS]: {
      actionType: SDK_DEPARTMENT_UPDATE,
      payloadTransformer: (payload) => payload.detail
    }
  };
  const baseEventMap = {
    [API_ON_CLOSE_NAME]: { actionType: EXECUTE_API_ON_CLOSE_CALLBACK },
    [API_ON_OPEN_NAME]: { actionType: EXECUTE_API_ON_OPEN_CALLBACK }
  };
  const eventDispatchWrapperFn = (actionType, selectors = [], payloadTransformer) => {
    return (reduxStore, callback) => {
      if (_.isFunction(callback)) {
        reduxStore.dispatch(handleOnApiCalled(actionType, selectors, callback, payloadTransformer));
      }
    };
  };
  const eventApiReducerFn = (eventMap) => {
    return _.reduce(eventMap, (apiObj, eventObj, eventName) => {
      const { actionType, selectors, payloadTransformer } = eventObj;

      apiObj[eventName] = eventDispatchWrapperFn(actionType, selectors, payloadTransformer);

      return apiObj;
    }, {});
  };

  return {
    'chat': eventApiReducerFn(chatEventMap),
    ...eventApiReducerFn(baseEventMap)
  };
};

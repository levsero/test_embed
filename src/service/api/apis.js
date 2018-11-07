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
  API_ON_CHAT_UNREAD_MESSAGES_NAME } from 'constants/api';
import {
  CHAT_CONNECTED,
  END_CHAT_REQUEST_SUCCESS,
  NEW_AGENT_MESSAGE_RECEIVED,
  CHAT_STARTED,
  SDK_ACCOUNT_STATUS } from 'src/redux/modules/chat/chat-action-types';
import { chatLogout, sendVisitorPath, endChat, sendMsg } from 'src/redux/modules/chat';
import { getWidgetDisplayInfo } from 'src/redux/modules/selectors';
import {
  getDepartment,
  getDepartmentsList,
  getIsChatting,
  getNotificationCount,
  getChatStatus } from 'src/redux/modules/chat/chat-selectors';
import { EXECUTE_API_ON_CLOSE_CALLBACK, EXECUTE_API_ON_OPEN_CALLBACK } from 'src/redux/modules/base/base-action-types';
import { updateSettings } from 'src/redux/modules/settings';
import { setContextualSuggestionsManually } from 'src/redux/modules/helpCenter';

import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';

import { handleOnApiCalled } from 'src/redux/modules/base/base-actions';

export const endChatApi = (reduxStore) => {
  reduxStore.dispatch(endChat());
};

export const sendChatMsgApi = (reduxStore, msg) => {
  const message = (_.isString(msg)) ? msg : '';

  reduxStore.dispatch(sendMsg(message));
};

export const identifyApi = (reduxStore, user) => {
  mediator.channel.broadcast('.onIdentify', user);
};

export const openApi = (reduxStore) => {
  reduxStore.dispatch(openReceived());
};

export const closeApi = (reduxStore) => {
  reduxStore.dispatch(closeReceived());
};

export const toggleApi = (reduxStore) => {
  reduxStore.dispatch(toggleReceived());
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
    }
  };
  const baseEventMap = {
    [API_ON_CLOSE_NAME]: { actionType: EXECUTE_API_ON_CLOSE_CALLBACK },
    [API_ON_OPEN_NAME]: { actionType: EXECUTE_API_ON_OPEN_CALLBACK }
  };
  const eventDispatchWrapperFn = (actionType, selectors = []) => {
    return (reduxStore, callback) => {
      if (_.isFunction(callback)) {
        reduxStore.dispatch(handleOnApiCalled(actionType, selectors, callback));
      }
    };
  };
  const eventApiReducerFn = (eventMap) => {
    return _.reduce(eventMap, (apiObj, eventObj, eventName) => {
      const { actionType, selectors } = eventObj;

      apiObj[eventName] = eventDispatchWrapperFn(actionType, selectors);

      return apiObj;
    }, {});
  };

  return {
    'chat': eventApiReducerFn(chatEventMap),
    ...eventApiReducerFn(baseEventMap)
  };
};

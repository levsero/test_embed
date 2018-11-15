import {
  endChatApi,
  openApi,
  closeApi,
  toggleApi,
  sendChatMsgApi,
  displayApi,
  isChattingApi,
  getDepartmentApi,
  getAllDepartmentsApi,
  showApi,
  updatePathApi,
  clearFormState,
  onApiObj,
  updateSettingsApi,
  hideApi,
  setLocaleApi,
  prefill,
  setHelpCenterSuggestionsApi,
  identifyApi,
  logoutApi
} from 'src/service/api/apis';
import {
  API_GET_IS_CHATTING_NAME,
  API_GET_DEPARTMENTS_ALL_NAME,
  API_GET_DEPARTMENTS_DEPARTMENT_NAME,
  API_GET_DISPLAY_NAME
} from 'constants/api';
import { getLauncherVisible } from 'src/redux/modules/base/base-selectors';
import { apiResetWidget } from 'src/redux/modules/base';
import _ from 'lodash';
import tracker from 'service/logging/tracker';

export const getApiObj = () => {
  return {
    chat: {
      [API_GET_IS_CHATTING_NAME]: isChattingApi,
      [API_GET_DEPARTMENTS_ALL_NAME]: getAllDepartmentsApi,
      [API_GET_DEPARTMENTS_DEPARTMENT_NAME]: getDepartmentApi
    },
    [API_GET_DISPLAY_NAME]: displayApi
  };
};

export const getWidgetChatApiObj = () => {
  return {
    end: endChatApi,
    send: sendChatMsgApi
  };
};

export const resetWidget = (reduxStore) => {
  const state = reduxStore.getState();

  if (getLauncherVisible(state)) {
    reduxStore.dispatch(apiResetWidget());
  }
};

export const apiExecute = (apiStructure, reduxStore, args) => {
  const getApiFunction = (methodAccessors) => {
    const keys = _.flatten(methodAccessors.map((accessor => {
      return accessor.split(':');
    }))).join('.');

    return _.get(apiStructure, keys, () => {});
  };
  const params = Array.from(args);

  /*
   Assume the first two arguments provided by the user will be method accessor params.
   Any subsequent parameters provided will be additional data for whatever api they are calling (eg. callbacks).
  */
  const methodAccessorParams = params.slice(0, 2);
  const apiMethodParams = params.slice(2);
  const apiFunction = getApiFunction(methodAccessorParams);

  tracker.track(`${methodAccessorParams[0]}.${methodAccessorParams[1]}`, ...apiMethodParams);

  return apiFunction(reduxStore, ...apiMethodParams);
};

export const apiStructurePreRenderSetup = (apiAddToPostRenderQueue, getApiPostRenderQueue) => {
  return {
    webWidget: {
      hide: hideApi,
      show: (_, ...args) => apiAddToPostRenderQueue(['webWidget', 'show', ...args]),
      open: openApi,
      close: closeApi,
      toggle: toggleApi,
      setLocale: setLocaleApi,
      identify: (_, ...args) => apiAddToPostRenderQueue(['webWidget', 'identify', ...args]),
      updateSettings: (_, ...args) => apiAddToPostRenderQueue(['webWidget', 'updateSettings', ...args]),
      logout: (_, ...args) => apiAddToPostRenderQueue(['webWidget', 'logout', ...args]),
      updatePath: (_, ...args) => apiAddToPostRenderQueue(['webWidget', 'updatePath', ...args]),
      clear: (reduxStore) => clearFormState(reduxStore),
      reset: (reduxStore) => resetWidget(reduxStore),
      prefill: prefill,
      chat: getWidgetChatApiObj(),
      on: onApiObj(),
      get: getApiPostRenderQueue(),
      helpCenter: {
        setSuggestions: (_, ...args) => (
          apiAddToPostRenderQueue(['webWidget', 'helpCenter:setSuggestions', ...args])
        )
      }
    }
  };
};

export const apiStructurePostRenderSetup = () => {
  return {
    webWidget: {
      hide: hideApi,
      show: showApi,
      open: openApi,
      close: closeApi,
      toggle: toggleApi,
      setLocale: setLocaleApi,
      identify: identifyApi,
      updateSettings: updateSettingsApi,
      logout: logoutApi,
      updatePath: updatePathApi,
      clear: clearFormState,
      prefill: prefill,
      chat: getWidgetChatApiObj(),
      on: onApiObj(),
      get: getApiObj(),
      helpCenter: {
        setSuggestions: setHelpCenterSuggestionsApi
      },
      reset: resetWidget
    }
  };
};

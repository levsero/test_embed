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
  reauthenticateHelpCenter,
  updatePathApi,
  clearFormState,
  onApiObj,
  updateSettingsApi,
  hideApi,
  setLocaleApi,
  prefill,
  setHelpCenterSuggestionsApi,
  identifyApi,
  logoutApi,
  popoutApi,
  addTagsApi,
  removeTagsApi,
  reauthenticateApi,
} from 'src/service/api/apis'
import {
  API_GET_IS_CHATTING_NAME,
  API_GET_DEPARTMENTS_ALL_NAME,
  API_GET_DEPARTMENTS_DEPARTMENT_NAME,
  API_GET_DISPLAY_NAME,
} from 'constants/api'
import { getLauncherVisible } from 'src/redux/modules/base/base-selectors'
import { apiResetWidget } from 'src/redux/modules/base'
import _ from 'lodash'
import tracker from 'service/tracker'

export const getApiObj = () => {
  return {
    chat: {
      [API_GET_IS_CHATTING_NAME]: isChattingApi,
      [API_GET_DEPARTMENTS_ALL_NAME]: getAllDepartmentsApi,
      [API_GET_DEPARTMENTS_DEPARTMENT_NAME]: getDepartmentApi,
    },
    [API_GET_DISPLAY_NAME]: displayApi,
  }
}

const getApiPreRenderQueue = (apiAddToPostRenderQueue) => {
  return {
    chat: {
      [API_GET_IS_CHATTING_NAME]: () =>
        apiAddToPostRenderQueue(['webWidget:get', 'chat:isChatting']),
      [API_GET_DEPARTMENTS_ALL_NAME]: (_, ...args) =>
        apiAddToPostRenderQueue(['webWidget:get', 'chat:departments', ...args]),
      [API_GET_DEPARTMENTS_DEPARTMENT_NAME]: (_, ...args) =>
        apiAddToPostRenderQueue(['webWidget:get', 'chat:department', ...args]),
    },
    [API_GET_DISPLAY_NAME]: () => apiAddToPostRenderQueue(['webWidget:get', 'display']),
  }
}

export const chatApiObj = () => {
  return {
    addTags: (store, ...args) => addTagsApi(store)(...args),
    removeTags: (store, ...args) => removeTagsApi(store)(...args),
    end: endChatApi,
    send: sendChatMsgApi,
    reauthenticate: reauthenticateApi,
  }
}

export const resetWidget = (reduxStore) => {
  const state = reduxStore.getState()

  if (getLauncherVisible(state)) {
    reduxStore.dispatch(apiResetWidget())
  }
}

export const apiExecute = (apiStructure, reduxStore, args) => {
  const getApiFunction = (methodAccessors) => {
    const keys = _.flatten(
      methodAccessors.map((accessor) => {
        return accessor.split(':')
      })
    ).join('.')

    const apiFunction = _.get(apiStructure, keys)

    if (!apiFunction) {
      throw new Error(`Method ${keys} does not exist`)
    }

    return _.get(apiStructure, keys)
  }
  const params = Array.from(args)

  /*
   Assume the first two arguments provided by the user will be method accessor params.
   Any subsequent parameters provided will be additional data for whatever api they are calling (eg. callbacks).
  */
  const methodAccessorParams = params.slice(0, 2)
  const apiMethodParams = params.slice(2)
  const apiFunction = getApiFunction(methodAccessorParams)

  tracker.track(`${methodAccessorParams[0]}.${methodAccessorParams[1]}`, ...apiMethodParams)

  return apiFunction(reduxStore, ...apiMethodParams)
}

export const apiStructurePreRenderSetup = (apiAddToPostRenderQueue) => {
  return {
    webWidget: {
      hide: hideApi,
      show: showApi,
      open: () => apiAddToPostRenderQueue(['webWidget', 'open']),
      close: closeApi,
      toggle: () => apiAddToPostRenderQueue(['webWidget', 'toggle']),
      setLocale: setLocaleApi,
      identify: (_, ...args) => apiAddToPostRenderQueue(['webWidget', 'identify', ...args]),
      updateSettings: (_, ...args) =>
        apiAddToPostRenderQueue(['webWidget', 'updateSettings', ...args]),
      logout: (_, ...args) => apiAddToPostRenderQueue(['webWidget', 'logout', ...args]),
      updatePath: (_, ...args) => apiAddToPostRenderQueue(['webWidget', 'updatePath', ...args]),
      clear: (reduxStore) => clearFormState(reduxStore),
      reset: (reduxStore) => resetWidget(reduxStore),
      prefill: prefill,
      chat: chatApiObj(),
      on: onApiObj(),
      get: getApiPreRenderQueue(apiAddToPostRenderQueue),
      helpCenter: {
        reauthenticate: (reduxStore) => reauthenticateHelpCenter(reduxStore),
        setSuggestions: (_, ...args) =>
          apiAddToPostRenderQueue(['webWidget', 'helpCenter:setSuggestions', ...args]),
      },
      popout: popoutApi,
    },
  }
}

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
      chat: chatApiObj(),
      on: onApiObj(),
      get: getApiObj(),
      helpCenter: {
        setSuggestions: setHelpCenterSuggestionsApi,
        reauthenticate: reauthenticateHelpCenter,
      },
      reset: resetWidget,
      popout: popoutApi,
    },
  }
}

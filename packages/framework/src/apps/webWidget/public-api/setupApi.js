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
} from 'service/api/apis'
import {
  API_GET_IS_CHATTING_NAME,
  API_GET_DEPARTMENTS_ALL_NAME,
  API_GET_DEPARTMENTS_DEPARTMENT_NAME,
  API_GET_DISPLAY_NAME,
  API_ON_CHAT_CONNECTED_NAME,
  API_ON_CHAT_END_NAME,
  API_ON_CHAT_START_NAME,
  API_ON_CHAT_DEPARTMENT_STATUS,
  API_ON_CHAT_UNREAD_MESSAGES_NAME,
  API_ON_CHAT_STATUS_NAME,
  API_ON_CHAT_POPOUT,
  API_ON_OPEN_NAME,
  API_ON_CLOSE_NAME,
} from 'constants/api'
import { getLauncherVisible } from 'src/redux/modules/base/base-selectors'
import { apiResetWidget } from 'src/redux/modules/base'
import _ from 'lodash'
import tracker from 'service/tracker'
import * as callbacks from 'service/api/callbacks'
import {
  CHAT_CONNECTED_EVENT,
  CHAT_DEPARTMENT_STATUS_EVENT,
  CHAT_ENDED_EVENT,
  CHAT_POPOUT_EVENT,
  CHAT_STARTED_EVENT,
  CHAT_STATUS_EVENT,
  CHAT_UNREAD_MESSAGES_EVENT,
  USER_EVENT,
  WIDGET_CLOSED_EVENT,
  WIDGET_OPENED_EVENT,
} from 'constants/event'
import {
  getChatStatus,
  getHasBackfillCompleted,
  getNotificationCount,
} from 'src/redux/modules/chat/chat-selectors'

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

const wrapAllFunctionsWithRedux = (reduxStore, group) => {
  Object.keys(group).forEach((key) => {
    const value = group[key]

    if (typeof value === 'function') {
      group[key] = (...args) => value(reduxStore, ...args)
    } else {
      wrapAllFunctionsWithRedux(reduxStore, value)
    }
  })

  return group
}

export const getWebWidgetPublicApi = (reduxStore) => {
  return wrapAllFunctionsWithRedux(reduxStore, {
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
      'chat:addTags': (store, ...args) => addTagsApi(store)(...args),
      'chat:removeTags': (store, ...args) => removeTagsApi(store)(...args),
      'chat:end': endChatApi,
      'chat:send': sendChatMsgApi,
      'chat:reauthenticate': reauthenticateApi,
      reset: resetWidget,
      popout: popoutApi,
      'helpCenter:reauthenticate': reauthenticateHelpCenter,
      'helpCenter:setSuggestions': setHelpCenterSuggestionsApi,
    },
    'webWidget:on': {
      userEvent: (_reduxStore, cb) => {
        callbacks.registerCallback(cb, USER_EVENT)
      },
      [API_ON_OPEN_NAME]: (_reduxStore, cb) => callbacks.registerCallback(cb, WIDGET_OPENED_EVENT),
      [API_ON_CLOSE_NAME]: (_reduxStore, cb) => callbacks.registerCallback(cb, WIDGET_CLOSED_EVENT),
      [`chat:${API_ON_CHAT_CONNECTED_NAME}`]: (_reduxStore, cb) =>
        callbacks.registerCallback(cb, CHAT_CONNECTED_EVENT),
      [`chat:${API_ON_CHAT_END_NAME}`]: (_reduxStore, cb) =>
        callbacks.registerCallback(cb, CHAT_ENDED_EVENT),
      [`chat:${API_ON_CHAT_START_NAME}`]: (reduxStore, cb) =>
        callbacks.registerCallback(() => {
          if (getHasBackfillCompleted(reduxStore.getState())) {
            cb()
          }
        }, CHAT_STARTED_EVENT),
      [`chat:${API_ON_CHAT_DEPARTMENT_STATUS}`]: (_reduxStore, cb) => {
        callbacks.registerCallback(cb, CHAT_DEPARTMENT_STATUS_EVENT)
      },
      [`chat:${API_ON_CHAT_UNREAD_MESSAGES_NAME}`]: (store, cb) => {
        callbacks.registerCallback(
          () => cb(getNotificationCount(store.getState())),
          CHAT_UNREAD_MESSAGES_EVENT
        )
      },
      [`chat:${API_ON_CHAT_STATUS_NAME}`]: (store, cb) => {
        callbacks.registerCallback(() => cb(getChatStatus(store.getState())), CHAT_STATUS_EVENT)
      },
      [`chat:${API_ON_CHAT_POPOUT}`]: (store, cb) => {
        callbacks.registerCallback(() => cb(getChatStatus(store.getState())), CHAT_POPOUT_EVENT)
      },
    },
    'webWidget:get': {
      [API_GET_DISPLAY_NAME]: displayApi,
      [`chat:${API_GET_IS_CHATTING_NAME}`]: isChattingApi,
      [`chat:${API_GET_DEPARTMENTS_ALL_NAME}`]: getAllDepartmentsApi,
      [`chat:${API_GET_DEPARTMENTS_DEPARTMENT_NAME}`]: getDepartmentApi,
    },
  })
}

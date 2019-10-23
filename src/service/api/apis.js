import _ from 'lodash'

import {
  handlePrefillReceived,
  logout,
  apiClearForm,
  showReceived,
  hideReceived,
  openReceived,
  closeReceived,
  toggleReceived
} from 'src/redux/modules/base'
import {
  API_ON_CHAT_STATUS_NAME,
  API_ON_CLOSE_NAME,
  API_ON_OPEN_NAME,
  API_ON_CHAT_CONNECTED_NAME,
  API_ON_CHAT_START_NAME,
  API_ON_CHAT_END_NAME,
  API_ON_CHAT_UNREAD_MESSAGES_NAME,
  API_ON_CHAT_DEPARTMENT_STATUS,
  API_ON_CHAT_POPOUT
} from 'constants/api'
import {
  WIDGET_OPENED_EVENT,
  WIDGET_CLOSED_EVENT,
  CHAT_CONNECTED_EVENT,
  CHAT_ENDED_EVENT,
  CHAT_STARTED_EVENT,
  CHAT_STATUS_EVENT,
  CHAT_UNREAD_MESSAGES_EVENT,
  CHAT_DEPARTMENT_STATUS_EVENT,
  CHAT_POPOUT_EVENT
} from 'constants/event'
import { chatLogout, sendVisitorPath, endChat, sendMsg } from 'src/redux/modules/chat/chat-actions'
import { getWidgetDisplayInfo } from 'src/redux/modules/selectors'
import {
  getDepartment,
  getDepartmentsList,
  getIsChatting,
  getIsPopoutAvailable,
  getZChatVendor,
  getNotificationCount,
  getChatStatus,
  getHasBackfillCompleted
} from 'src/redux/modules/chat/chat-selectors'
import { updateSettings } from 'src/redux/modules/settings'
import { setContextualSuggestionsManually } from 'embeds/helpCenter/actions'
import { getSettingsChatPopout } from 'src/redux/modules/settings/settings-selectors'

import { chat as zopimChat } from 'embed/chat/chat'
import { i18n } from 'service/i18n'
import { identity } from 'service/identity'
import { mediator } from 'service/mediator'
import { beacon } from 'service/beacon'
import { createChatPopoutWindow } from 'src/util/chat'
import { nameValid, emailValid } from 'utility/utils'
import { apiResetWidget } from 'src/redux/modules/base/base-actions'
import { getActiveEmbed, getWidgetAlreadyHidden } from 'src/redux/modules/base/base-selectors'
import * as callbacks from 'service/api/callbacks'

export const endChatApi = reduxStore => {
  reduxStore.dispatch(endChat())
}

export const sendChatMsgApi = (reduxStore, msg) => {
  const message = _.isString(msg) ? msg : ''

  reduxStore.dispatch(sendMsg(message))
}

export const identifyApi = (_reduxStore, user) => {
  const isEmailValid = emailValid(user.email),
    isNameValid = nameValid(user.name)

  if (isEmailValid && isNameValid) {
    beacon.identify(user)
    identity.setUserIdentity(user.name, user.email)
    zopimChat.setUser(user)
  } else if (isEmailValid) {
    console.warn('invalid name passed into zE.identify', user.name) // eslint-disable-line no-console
    zopimChat.setUser(user)
  } else if (isNameValid) {
    console.warn('invalid email passed into zE.identify', user.email) // eslint-disable-line no-console
    zopimChat.setUser(user)
  } else {
    console.warn('invalid params passed into zE.identify', user) // eslint-disable-line no-console
  }
}

export const openApi = reduxStore => {
  const state = reduxStore.getState()

  if (getActiveEmbed(state) === 'zopimChat') {
    mediator.channel.broadcast('zopimChat.show')
  } else {
    reduxStore.dispatch(openReceived())
  }
}

export const closeApi = reduxStore => {
  const state = reduxStore.getState()

  if (getActiveEmbed(state) === 'zopimChat') {
    mediator.channel.broadcast('zopimChat.hide')
  }

  reduxStore.dispatch(closeReceived())
}

export const toggleApi = reduxStore => {
  const state = reduxStore.getState()

  if (getActiveEmbed(state) === 'zopimChat') {
    mediator.channel.broadcast('zopimChat.toggle')
  } else {
    reduxStore.dispatch(toggleReceived())
  }
}

export const setLocaleApi = locale => {
  i18n.setLocale(locale, () => {
    mediator.channel.broadcast('.onSetLocale')
  })
}

export const updateSettingsApi = (reduxStore, newSettings) => {
  reduxStore.dispatch(updateSettings(newSettings))
}

export const logoutApi = reduxStore => {
  reduxStore.dispatch(logout())
  reduxStore.dispatch(closeReceived())
  mediator.channel.broadcast('.logout')
  reduxStore.dispatch(chatLogout())
  reduxStore.dispatch(apiResetWidget())
}

export const setHelpCenterSuggestionsApi = (reduxStore, options) => {
  const onDone = () => mediator.channel.broadcast('.setHelpCenterSuggestions')

  reduxStore.dispatch(setContextualSuggestionsManually(options, onDone))
}

export const prefill = (reduxStore, payload) => {
  reduxStore.dispatch(handlePrefillReceived(payload))
}

export const hideApi = reduxStore => {
  const state = reduxStore.getState()

  if (getWidgetAlreadyHidden(state)) return
  reduxStore.dispatch(hideReceived())
}

export const showApi = reduxStore => {
  const state = reduxStore.getState()

  if (!getWidgetAlreadyHidden(state)) return
  reduxStore.dispatch(showReceived())
}

export const popoutApi = reduxStore => {
  const reduxState = reduxStore.getState()

  if (getIsPopoutAvailable(reduxState)) {
    createChatPopoutWindow(
      getSettingsChatPopout(reduxState),
      getZChatVendor(reduxState).getMachineId(),
      i18n.getLocale()
    )
  }
}

export const updatePathApi = (reduxStore, page = {}) => {
  reduxStore.dispatch(sendVisitorPath(page))
}

export const clearFormState = reduxStore => {
  reduxStore.dispatch(apiClearForm())
}

export const displayApi = (reduxStore, ...args) =>
  getWidgetDisplayInfo(reduxStore.getState(), ...args)

export const isChattingApi = (reduxStore, ...args) => getIsChatting(reduxStore.getState(), ...args)

export const getDepartmentApi = (reduxStore, ...args) =>
  getDepartment(reduxStore.getState(), ...args)

export const getAllDepartmentsApi = (reduxStore, ...args) =>
  getDepartmentsList(reduxStore.getState(), ...args)

export const onApiObj = () => {
  return {
    chat: {
      [API_ON_CHAT_CONNECTED_NAME]: (_reduxStore, cb) =>
        callbacks.registerCallback(cb, CHAT_CONNECTED_EVENT),
      [API_ON_CHAT_END_NAME]: (_reduxStore, cb) => callbacks.registerCallback(cb, CHAT_ENDED_EVENT),
      [API_ON_CHAT_START_NAME]: (reduxStore, cb) =>
        callbacks.registerCallback(() => {
          if (getHasBackfillCompleted(reduxStore.getState())) {
            cb()
          }
        }, CHAT_STARTED_EVENT),
      [API_ON_CHAT_DEPARTMENT_STATUS]: (_reduxStore, cb) => {
        callbacks.registerCallback(cb, CHAT_DEPARTMENT_STATUS_EVENT)
      },
      [API_ON_CHAT_UNREAD_MESSAGES_NAME]: (store, cb) => {
        callbacks.registerCallback(
          () => cb(getNotificationCount(store.getState())),
          CHAT_UNREAD_MESSAGES_EVENT
        )
      },
      [API_ON_CHAT_STATUS_NAME]: (store, cb) => {
        callbacks.registerCallback(() => cb(getChatStatus(store.getState())), CHAT_STATUS_EVENT)
      },
      [API_ON_CHAT_POPOUT]: (store, cb) => {
        callbacks.registerCallback(() => cb(getChatStatus(store.getState())), CHAT_POPOUT_EVENT)
      }
    },
    [API_ON_OPEN_NAME]: (_reduxStore, cb) => callbacks.registerCallback(cb, WIDGET_OPENED_EVENT),
    [API_ON_CLOSE_NAME]: (_reduxStore, cb) => callbacks.registerCallback(cb, WIDGET_CLOSED_EVENT)
  }
}

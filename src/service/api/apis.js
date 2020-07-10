import _ from 'lodash'

import {
  handlePrefillReceived,
  logout,
  apiClearForm,
  showReceived,
  hideReceived,
  openReceived,
  closeReceived,
  toggleReceived,
  handlePopoutCreated
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
  CHAT_POPOUT_EVENT,
  USER_EVENT
} from 'constants/event'
import {
  chatLogout,
  sendVisitorPath,
  endChat,
  sendMsg,
  setVisitorInfo
} from 'src/redux/modules/chat/chat-actions'
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

import { i18n } from 'service/i18n'
import { identity } from 'service/identity'
import { beacon } from 'service/beacon'
import { createChatPopoutWindow } from 'src/util/chat'
import { nameValid, emailValid } from 'utility/utils'
import { apiResetWidget } from 'src/redux/modules/base/base-actions'
import { getWidgetAlreadyHidden } from 'src/redux/modules/base/base-selectors'
import * as callbacks from 'service/api/callbacks'
import { onChatConnected } from 'src/service/api/zopimApi/callbacks'

const getTagsInString = tags => {
  return tags.reduce((newTags, tag) => {
    if (_.isEmpty(tag)) return newTags

    tag.split(',').forEach(subTag => {
      const newTag = subTag.trim()

      if (!_.isEmpty(newTag)) {
        newTags.push(newTag)
      }
    })

    return newTags
  }, [])
}

const updateTags = (store, args, type) => {
  onChatConnected(() => {
    const state = store.getState()
    const zChat = getZChatVendor(state)
    const tags = getTagsInString(_.flattenDeep(args))

    if (tags.length == 0) return

    if (type === 'remove') {
      zChat.removeTags(tags)
    } else {
      zChat.addTags(tags)
    }
  })
}

export const removeTagsApi = store => (...args) => updateTags(store, args, 'remove')

export const addTagsApi = store => (...args) => updateTags(store, args, 'add')

export const endChatApi = reduxStore => {
  reduxStore.dispatch(endChat())
}

export const sendChatMsgApi = (reduxStore, msg) => {
  const message = _.isString(msg) ? msg : ''

  reduxStore.dispatch(sendMsg(message))
}

export const identifyApi = (reduxStore, user) => {
  const isEmailValid = emailValid(user.email),
    isNameValid = nameValid(user.name)

  if (isEmailValid && isNameValid) {
    beacon.identify(user)
    identity.setUserIdentity(user.name, user.email)
    reduxStore.dispatch(setVisitorInfo({ display_name: user.name, email: user.email }))
  } else if (isEmailValid) {
    console.warn('invalid name passed into zE.identify', user.name) // eslint-disable-line no-console
    reduxStore.dispatch(setVisitorInfo({ email: user.email }))
  } else if (isNameValid) {
    console.warn('invalid email passed into zE.identify', user.email) // eslint-disable-line no-console
    reduxStore.dispatch(setVisitorInfo({ display_name: user.name }))
  } else {
    console.warn('invalid params passed into zE.identify', user) // eslint-disable-line no-console
  }
}

export const openApi = reduxStore => {
  reduxStore.dispatch(openReceived())
}

export const closeApi = reduxStore => {
  reduxStore.dispatch(closeReceived())
}

export const toggleApi = reduxStore => {
  reduxStore.dispatch(toggleReceived())
}

export const setLocaleApi = (reduxStore, locale) => {
  i18n.setLocale(locale)
}

export const updateSettingsApi = (reduxStore, newSettings) => {
  reduxStore.dispatch(updateSettings(newSettings))
}

export const logoutApi = reduxStore => {
  reduxStore.dispatch(logout())
  reduxStore.dispatch(closeReceived())
  reduxStore.dispatch(chatLogout())
  reduxStore.dispatch(apiResetWidget())
}

export const setHelpCenterSuggestionsApi = (reduxStore, options) => {
  reduxStore.dispatch(setContextualSuggestionsManually(options))
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
    reduxStore.dispatch(handlePopoutCreated())
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
    userEvent: (_reduxStore, cb) => {
      callbacks.registerCallback(cb, USER_EVENT)
    },
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

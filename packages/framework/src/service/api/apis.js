import _ from 'lodash'
import { setContextualSuggestionsManually } from 'embeds/helpCenter/actions'
import * as callbacks from 'service/api/callbacks'
import { beacon } from 'service/beacon'
import { identity } from 'service/identity'
import { i18n } from 'src/apps/webWidget/services/i18n'
import {
  API_ON_CHAT_STATUS_NAME,
  API_ON_CLOSE_NAME,
  API_ON_OPEN_NAME,
  API_ON_CHAT_CONNECTED_NAME,
  API_ON_CHAT_START_NAME,
  API_ON_CHAT_END_NAME,
  API_ON_CHAT_UNREAD_MESSAGES_NAME,
  API_ON_CHAT_DEPARTMENT_STATUS,
  API_ON_CHAT_POPOUT,
} from 'src/constants/api'
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
  USER_EVENT,
} from 'src/constants/event'
import {
  handlePrefillReceived,
  logout,
  apiClearForm,
  showReceived,
  hideReceived,
  openReceived,
  closeReceived,
  toggleReceived,
  handlePopoutCreated,
  renewToken,
} from 'src/redux/modules/base'
import { apiResetWidget } from 'src/redux/modules/base/base-actions'
import { getWidgetAlreadyHidden } from 'src/redux/modules/base/base-selectors'
import { setUpChat } from 'src/redux/modules/chat'
import {
  reinitialiseChat,
  sendVisitorPath,
  endChat,
  sendMsg,
  setVisitorInfo,
} from 'src/redux/modules/chat/chat-actions'
import {
  getDepartment,
  getDepartmentsList,
  getIsChatting,
  getIsPopoutAvailable,
  getChatConnected,
  getZChatVendor,
  getNotificationCount,
  getChatStatus,
  getHasBackfillCompleted,
} from 'src/redux/modules/chat/chat-selectors'
import { getWidgetDisplayInfo } from 'src/redux/modules/selectors'
import { updateSettings } from 'src/redux/modules/settings'
import { getSettingsChatPopout } from 'src/redux/modules/settings/settings-selectors'
import { onChatConnected } from 'src/service/api/zopimApi/callbacks'
import { createChatPopoutWindow } from 'src/util/chat'
import { nameValid, emailValid, phoneValid } from 'utility/utils'

const getTagsInString = (tags) => {
  return tags.reduce((newTags, tag) => {
    if (_.isEmpty(tag)) return newTags

    tag.split(',').forEach((subTag) => {
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

export const removeTagsApi = (store) => (...args) => updateTags(store, args, 'remove')

export const addTagsApi = (store) => (...args) => updateTags(store, args, 'add')

export const endChatApi = (reduxStore) => {
  reduxStore.dispatch(endChat())
}

export const sendChatMsgApi = (reduxStore, msg) => {
  const message = _.isString(msg) ? msg : ''

  reduxStore.dispatch(sendMsg(message))
}

export const reauthenticateApi = (reduxStore) => {
  reduxStore.dispatch(reinitialiseChat(true))
}

export const identifyApi = (reduxStore, user) => {
  const isEmailValid = user.email && emailValid(user.email)
  const isNameValid = user.name && nameValid(user.name)
  const isPhoneProvided = !!user.phone
  const isPhoneValid = isPhoneProvided && phoneValid(user.phone)

  const validUser = {
    ...(isEmailValid && { email: user.email }),
    ...(isNameValid && { name: user.name }),
    ...(isPhoneValid && { phone: user.phone }),
    organization: user.organization,
  }
  const validUserExist =
    validUser.email || validUser.name || validUser.phone || validUser.organization

  if (!validUserExist) {
    console.warn('invalid params passed into zE.identify', user) // eslint-disable-line no-console
  } else {
    !isNameValid && console.warn('invalid name passed into zE.identify', user.name) // eslint-disable-line no-console
    !isEmailValid && console.warn('invalid email passed into zE.identify', user.email) // eslint-disable-line no-console
    !isPhoneValid &&
      isPhoneProvided &&
      console.warn('invalid phone passed into zE.identify', user.phone) // eslint-disable-line no-console

    reduxStore.dispatch(
      // setVisitorInfo cannot accept undefined values.
      setVisitorInfo(
        {
          ...(validUser.name && { display_name: validUser.name }),
          ...(validUser.email && { email: validUser.email }),
          ...(validUser.phone && { phone: validUser.phone }),
        },
        undefined,
        'identify api'
      )
    )
  }

  if (isNameValid && isEmailValid && (!isPhoneProvided || isPhoneValid)) {
    beacon.identify(validUser, i18n.getLocaleId())
    identity.setUserIdentity(validUser)
  }
}

export const openApi = (reduxStore) => {
  reduxStore.dispatch(openReceived())
}

export const closeApi = (reduxStore) => {
  reduxStore.dispatch(closeReceived())
}

export const toggleApi = (reduxStore) => {
  reduxStore.dispatch(toggleReceived())
}

export const setLocaleApi = (reduxStore, locale) => {
  i18n.setLocale(locale)
}

export const updateSettingsApi = (reduxStore, newSettings) => {
  reduxStore.dispatch(updateSettings(newSettings))
}

export const logoutApi = (reduxStore) => {
  reduxStore.dispatch(logout())
  reduxStore.dispatch(closeReceived())
  reduxStore.dispatch(reinitialiseChat(false))
  reduxStore.dispatch(apiResetWidget())
}

export const setHelpCenterSuggestionsApi = (reduxStore, options) => {
  reduxStore.dispatch(setContextualSuggestionsManually(options))
}

export const prefill = (reduxStore, payload) => {
  reduxStore.dispatch(handlePrefillReceived(payload))
}

export const hideApi = (reduxStore) => {
  const state = reduxStore.getState()

  if (getWidgetAlreadyHidden(state)) return
  reduxStore.dispatch(hideReceived())
}

export const showApi = (reduxStore) => {
  const state = reduxStore.getState()

  if (!getWidgetAlreadyHidden(state)) return
  reduxStore.dispatch(showReceived())
}

export const reauthenticateHelpCenter = (reduxStore) => {
  reduxStore.dispatch(renewToken())
}

const createPopout = (dispatch, getState) => {
  const reduxState = getState()
  createChatPopoutWindow(
    getSettingsChatPopout(reduxState),
    getZChatVendor(reduxState).getMachineId(),
    i18n.getLocale()
  )
  dispatch(handlePopoutCreated())
}

export const popoutApi = (reduxStore) => {
  const reduxState = reduxStore.getState()
  if (getIsPopoutAvailable(reduxState)) {
    if (getChatConnected(reduxState)) {
      createPopout(reduxStore.dispatch, reduxStore.getState)
    } else {
      reduxStore.dispatch(
        setUpChat(false, () => {
          createPopout(reduxStore.dispatch, reduxStore.getState)
        })
      )
    }
  }
}

export const updatePathApi = (reduxStore, page = {}) => {
  reduxStore.dispatch(sendVisitorPath(page))
}

export const clearFormState = (reduxStore) => {
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
      },
    },
    [API_ON_OPEN_NAME]: (_reduxStore, cb) => callbacks.registerCallback(cb, WIDGET_OPENED_EVENT),
    [API_ON_CLOSE_NAME]: (_reduxStore, cb) => callbacks.registerCallback(cb, WIDGET_CLOSED_EVENT),
  }
}

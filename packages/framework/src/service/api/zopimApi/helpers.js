import _ from 'lodash'
import { CHAT_STATUS_EVENT, CHAT_DEPARTMENT_STATUS_EVENT } from 'src/constants/event'
import { badgeHideReceived, badgeShowReceived } from 'src/redux/modules/base'
import { getChatStatus } from 'src/redux/modules/chat/chat-selectors'
import { updateSettingsApi } from 'src/service/api/apis'
import * as callbacks from 'src/service/api/callbacks'
import tracker from 'src/service/tracker'

export const setPositionApi = (store) => (position) => {
  const mapPositions = {
    b: 'bottom',
    t: 'top',
    m: null,
    r: 'right',
    l: 'left',
  }
  const verticalVal = mapPositions[position[0]]
  const horizontalVal = mapPositions[position[1]]

  if (horizontalVal === 'left' || horizontalVal === 'right') {
    updateSettings(store, 'webWidget.position.horizontal', horizontalVal)
  }

  if (verticalVal === 'top' || verticalVal === 'bottom') {
    updateSettings(store, 'webWidget.position.vertical', verticalVal)
  }
}

export const setOffsetApi = (store) => {
  return {
    setOffsetVertical: (dist) => updateSettings(store, 'webWidget.offset.vertical', dist),
    setOffsetHorizontal: (dist) => updateSettings(store, 'webWidget.offset.horizontal', dist),
  }
}

export const setOffsetMobileApi = (store) => {
  return {
    setOffsetVerticalMobile: (dist) =>
      updateSettings(store, 'webWidget.offset.mobile.vertical', dist),
    setOffsetHorizontalMobile: (dist) =>
      updateSettings(store, 'webWidget.offset.mobile.horizontal', dist),
  }
}

export const setGreetingsApi = (store, greetings) => {
  const onlineGreeting = _.get(greetings, 'online')
  const offlineGreeting = _.get(greetings, 'offline')

  if (_.isString(onlineGreeting)) {
    updateSettings(store, 'webWidget.launcher.chatLabel.*', onlineGreeting)
  }

  if (_.isString(offlineGreeting)) {
    updateSettings(store, 'webWidget.launcher.label.*', offlineGreeting)
  }
}

export const setProfileCardConfigApi = (store) => (settings) => {
  const newSettings = {
    webWidget: {
      chat: {
        profileCard: {},
      },
    },
  }
  const { profileCard } = newSettings.webWidget.chat

  if (_.isBoolean(settings.avatar)) {
    profileCard.avatar = settings.avatar
  }
  if (_.isBoolean(settings.title)) {
    profileCard.title = settings.title
  }
  if (_.isBoolean(settings.rating)) {
    profileCard.rating = settings.rating
  }

  updateSettingsApi(store, newSettings)
}

const upperCaseFirstChar = (str) => {
  str += ''
  return str.charAt(0).toUpperCase() + str.substring(1)
}

const supportedSetters = [
  'color',
  'name',
  'email',
  'language',
  'phone',
  'status',
  'greetings',
  'disableGoogleAnalytics',
  'onConnected',
  'onChatStart',
  'onChatEnd',
  'onStatus',
  'onUnreadMsgs',
]

export const setApi = (win, options) => {
  for (let name in options) {
    if (_.includes(supportedSetters, name)) {
      const methodName = 'set' + upperCaseFirstChar(name)
      const arg = options[name]

      win.$zopim.livechat[methodName](arg)
    }
  }
}

export const updateSettings = (store, s, val) => {
  const newSettings = _.set({}, s, val)

  updateSettingsApi(store, newSettings)
}

export function zopimExistsOnPage(win) {
  return !!win.$zopim
}

export const setOnStatusApi = (store, callback) => {
  if (_.isFunction(callback)) {
    const wrappedCallbackWithArgs = () => {
      const chatStatus = getChatStatus(store.getState())

      if (!chatStatus) {
        return
      }

      callback(chatStatus)
    }

    // setOn* Callbacks are called immediately in the old zopim experience.
    // This is done for feature parity, even though it is _technically_
    // not quite correct, but we must match what old Zopim does.
    // Jira: https://zendesk.atlassian.net/browse/EWW-507
    // Slack convo for context:
    // https://zendesk.slack.com/archives/C0R1EJ3UP/p1564446511266300
    wrappedCallbackWithArgs()

    const debouncedWrappedCallbackWithArgs = _.debounce(wrappedCallbackWithArgs, 0)

    callbacks.registerCallback(debouncedWrappedCallbackWithArgs, CHAT_STATUS_EVENT)
    callbacks.registerCallback(debouncedWrappedCallbackWithArgs, CHAT_DEPARTMENT_STATUS_EVENT)
  }
}

export const showBadgeApi = (store) => {
  store.dispatch(badgeShowReceived())
}

export const hideBadgeApi = (store) => {
  store.dispatch(badgeHideReceived())
}

export function trackZopimApis(win) {
  tracker.addToMethod(win.$zopim.livechat, 'getName', '$zopim.livechat.getName')
  tracker.addToMethod(win.$zopim.livechat, 'getEmail', '$zopim.livechat.getEmail')
  tracker.addToMethod(win.$zopim.livechat, 'getPhone', '$zopim.livechat.getPhone')
  tracker.addToMethod(win.$zopim.livechat, 'appendNotes', '$zopim.livechat.appendNotes')
  tracker.addToMethod(win.$zopim.livechat, 'setNotes', '$zopim.livechat.setNotes')
  tracker.addToMethod(win.$zopim.livechat.window, 'setSize', '$zopim.livechat.window.setSize')
  tracker.addToMethod(win.$zopim.livechat.window, 'show', '$zopim.livechat.window.show')
  tracker.addToMethod(
    win.$zopim.livechat.theme,
    'setFontConfig',
    '$zopim.livechat.theme.setFontConfig'
  )
  tracker.addTo(win.$zopim.livechat.cookieLaw, '$zopim.livechat.cookieLaw')
}

import _ from 'lodash'
import * as events from 'constants/event'
import errorTracker from 'src/framework/services/errorTracker'

const callbacksRegistry = {
  [events.WIDGET_OPENED_EVENT]: [],
  [events.WIDGET_CLOSED_EVENT]: [],
  [events.CHAT_CONNECTED_EVENT]: [],
  [events.CHAT_ENDED_EVENT]: [],
  [events.CHAT_STARTED_EVENT]: [],
  [events.CHAT_DEPARTMENT_STATUS_EVENT]: [],
  [events.CHAT_UNREAD_MESSAGES_EVENT]: [],
  [events.CHAT_STATUS_EVENT]: [],
  [events.CHAT_POPOUT_EVENT]: [],
  [events.USER_EVENT]: [],
}

const eventExists = (eventName) => _.has(callbacksRegistry, eventName)

export const registerCallback = (cb, eventName) => {
  if (!eventExists(eventName)) return

  callbacksRegistry[eventName].push(cb)
  if (callbacksRegistry[eventName].length > 3) {
    errorTracker.warn(`set ${eventName} listener multiple times`, {
      rollbarFingerprint: 'Set more than 3 of the same listener',
      rollbarTitle: 'Set more than 3 of the same listener',
    })
  }
}

export const fireFor = (eventName, args = []) => {
  if (!eventExists(eventName)) return

  callbacksRegistry[eventName].forEach((cb) => (_.isFunction(cb) ? cb(...args) : null))
}

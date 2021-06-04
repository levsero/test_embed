import _ from 'lodash'
import logger from 'src/util/logger'
import * as events from 'constants/event'

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

  if (callbacksRegistry[eventName].length > 3) {
    logger.warn(
      'You have tried to set the same listener too many times, only the 3 most recent ones will be called. \nCheck that you are not setting the listener inside a loop. This is not needed as the listener will trigger whenever needed and only needs to be set a single time.'
    )
    callbacksRegistry[eventName].pop(cb)
  }
  callbacksRegistry[eventName].push(cb)
}

export const fireFor = (eventName, args = []) => {
  if (!eventExists(eventName)) return

  callbacksRegistry[eventName].forEach((cb) => (_.isFunction(cb) ? cb(...args) : null))
}

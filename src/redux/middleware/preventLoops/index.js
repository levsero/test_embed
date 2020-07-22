import _ from 'lodash'
import InfiniteLoopError from 'errors/fatal/InfiniteLoopError'
import errorTracker from 'src/framework/services/errorTracker'
import { beacon } from 'service/beacon'
import {
  SDK_CHAT_MSG,
  CHAT_BOX_CHANGED,
  SDK_HISTORY_CHAT_MSG,
  CHAT_NOTIFICATION_RESET
} from 'src/redux/modules/chat/chat-action-types'

const actionsToSkip = [
  SDK_HISTORY_CHAT_MSG,
  SDK_CHAT_MSG,
  CHAT_BOX_CHANGED,
  CHAT_NOTIFICATION_RESET
]
let actionTimes = []
let actions = []

const TIME_WINDOW = 1000
const MAX_NUMBER_OF_ACTIONS = 200
const NUMBER_OF_ACTIONS_TO_SEND = 20

let loggedToRollbarAndBlips = false

export default _store => next => action => {
  const { type } = action

  if (_.includes(actionsToSkip, type)) return next(action)
  const now = Date.now()

  actionTimes.push(now)
  actionTimes = actionTimes.slice(-MAX_NUMBER_OF_ACTIONS)
  actions.push(type)
  actions = actions.slice(-NUMBER_OF_ACTIONS_TO_SEND)

  if (actionTimes.length === MAX_NUMBER_OF_ACTIONS && now - actionTimes[0] < TIME_WINDOW) {
    if (!loggedToRollbarAndBlips) {
      errorTracker.error(new InfiniteLoopError('infiniteLoopDetected'), {
        action: type,
        prevActions: actions
      })
      beacon.trackUserAction('infiniteLoopDetected', 'warning', {
        label: type,
        value: actions
      })
      loggedToRollbarAndBlips = true
    }
  }
  return next(action)
}

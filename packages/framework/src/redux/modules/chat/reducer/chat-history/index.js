import { combineReducers } from 'redux'

import hasMore from './has-more'
import chats from './chats'
import log from './log'
import requestStatus from './request-status'

export default combineReducers({
  hasMore,
  chats,
  log,
  requestStatus
})

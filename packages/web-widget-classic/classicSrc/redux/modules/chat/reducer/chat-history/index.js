import { combineReducers } from 'redux'
import chats from './chats'
import hasMore from './has-more'
import log from './log'
import requestStatus from './request-status'

export default combineReducers({
  hasMore,
  chats,
  log,
  requestStatus,
})

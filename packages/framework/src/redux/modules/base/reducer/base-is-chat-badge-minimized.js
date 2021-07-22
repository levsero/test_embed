import {
  SDK_CHAT_MSG,
  SDK_CHAT_FILE,
  SDK_CHAT_REQUEST_RATING,
} from 'src/redux/modules/chat/chat-action-types'
import { CHAT_MSG_REQUEST_SUCCESS } from 'src/redux/modules/chat/chat-action-types'
import {
  CHAT_BADGE_MINIMIZED,
  BADGE_SHOW_RECEIVED,
  BADGE_HIDE_RECEIVED,
} from '../base-action-types'

const initialState = false

const isChatBadgeMinimized = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case CHAT_BADGE_MINIMIZED:
    case CHAT_MSG_REQUEST_SUCCESS:
    case BADGE_HIDE_RECEIVED:
    case SDK_CHAT_MSG:
    case SDK_CHAT_FILE:
    case SDK_CHAT_REQUEST_RATING:
      return true
    case BADGE_SHOW_RECEIVED:
      return false
    default:
      return state
  }
}

export default isChatBadgeMinimized

import {
  LAUNCHER_CLICKED,
  CHAT_BADGE_CLICKED,
  CLOSE_BUTTON_CLICKED,
  LEGACY_SHOW_RECEIVED,
  ACTIVATE_RECEIVED,
  CANCEL_BUTTON_CLICKED,
  OPEN_RECEIVED,
  CLOSE_RECEIVED,
  TOGGLE_RECEIVED,
  POPOUT_BUTTON_CLICKED,
  UPDATE_ACTIVE_EMBED,
  SHOW_WIDGET
} from '../base-action-types'
import { ZOPIM_SHOW, ZOPIM_CHAT_GONE_OFFLINE } from '../../zopimChat/zopimChat-action-types'
import {
  CHAT_WINDOW_OPEN_ON_NAVIGATE,
  PROACTIVE_CHAT_NOTIFICATION_DISMISSED,
  CHAT_BANNED
} from '../../chat/chat-action-types'
import { NIL_EMBED } from 'constants/shared'
import { isPopout } from 'utility/globals'

const initialState = isPopout()

const webWidgetVisible = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case LAUNCHER_CLICKED:
    case CHAT_BADGE_CLICKED:
    case ACTIVATE_RECEIVED:
    case CHAT_WINDOW_OPEN_ON_NAVIGATE:
    case OPEN_RECEIVED:
    case ZOPIM_CHAT_GONE_OFFLINE:
    case SHOW_WIDGET:
      return true
    case CLOSE_BUTTON_CLICKED:
    case POPOUT_BUTTON_CLICKED:
    case ZOPIM_SHOW:
    case CHAT_BANNED:
    case LEGACY_SHOW_RECEIVED:
    case CANCEL_BUTTON_CLICKED:
    case PROACTIVE_CHAT_NOTIFICATION_DISMISSED:
    case CLOSE_RECEIVED:
      return false
    case TOGGLE_RECEIVED:
      return !state
    case UPDATE_ACTIVE_EMBED:
      if (payload === NIL_EMBED) return false
      return state
    default:
      return state
  }
}

export default webWidgetVisible

import { isPopout } from '@zendesk/widget-shared-services'
import {
  CHAT_WINDOW_OPEN_ON_NAVIGATE,
  PROACTIVE_CHAT_NOTIFICATION_DISMISSED,
  CHAT_BANNED,
} from '../../chat/chat-action-types'
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
  POPOUT_CREATED,
  SHOW_WIDGET,
  ESCAPE_KEY_PRESSED,
} from '../base-action-types'

const initialState = isPopout()

const webWidgetOpen = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case LAUNCHER_CLICKED:
    case CHAT_BADGE_CLICKED:
    case ACTIVATE_RECEIVED:
    case CHAT_WINDOW_OPEN_ON_NAVIGATE:
    case OPEN_RECEIVED:
    case SHOW_WIDGET:
      return true
    case CLOSE_BUTTON_CLICKED:
    case POPOUT_CREATED:
    case CHAT_BANNED:
    case LEGACY_SHOW_RECEIVED:
    case CANCEL_BUTTON_CLICKED:
    case PROACTIVE_CHAT_NOTIFICATION_DISMISSED:
    case CLOSE_RECEIVED:
    case ESCAPE_KEY_PRESSED:
      return false
    case TOGGLE_RECEIVED:
      return !state
    default:
      return state
  }
}

export default webWidgetOpen

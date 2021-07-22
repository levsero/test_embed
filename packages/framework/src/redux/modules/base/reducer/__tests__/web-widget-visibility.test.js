import {
  CHAT_WINDOW_OPEN_ON_NAVIGATE,
  PROACTIVE_CHAT_NOTIFICATION_DISMISSED,
  CHAT_BANNED,
} from 'src/redux/modules/chat/chat-action-types'
import { testReducer } from 'src/util/testHelpers'
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
  ESCAPE_KEY_PRESSED,
} from '../../base-action-types'
import webWidgetVisibility from '../web-widget-open'

testReducer(webWidgetVisibility, [
  {
    action: { type: undefined },
    expected: false,
  },
  {
    action: { type: 'DERP DERP' },
    initialState: true,
    expected: true,
  },
  {
    action: { type: LAUNCHER_CLICKED },
    expected: true,
  },
  {
    action: { type: CHAT_BADGE_CLICKED },
    expected: true,
  },
  {
    action: { type: ACTIVATE_RECEIVED },
    expected: true,
  },
  {
    action: { type: CHAT_WINDOW_OPEN_ON_NAVIGATE },
    expected: true,
  },
  {
    action: { type: OPEN_RECEIVED },
    expected: true,
  },
  {
    action: { type: CLOSE_BUTTON_CLICKED },
    expected: false,
  },
  {
    action: { type: POPOUT_CREATED },
    expected: false,
  },
  {
    action: { type: LEGACY_SHOW_RECEIVED },
    expected: false,
  },
  {
    action: { type: CANCEL_BUTTON_CLICKED },
    expected: false,
  },
  {
    action: { type: PROACTIVE_CHAT_NOTIFICATION_DISMISSED },
    expected: false,
  },
  {
    action: { type: CHAT_BANNED },
    expected: false,
  },
  {
    action: { type: CLOSE_RECEIVED },
    expected: false,
  },
  {
    action: { type: ESCAPE_KEY_PRESSED },
    expected: false,
  },
  {
    action: { type: TOGGLE_RECEIVED },
    initialState: false,
    expected: true,
  },
])

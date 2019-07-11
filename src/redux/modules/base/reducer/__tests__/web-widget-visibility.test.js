import webWidgetVisibility from '../web-widget-visibility'
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
  UPDATE_ACTIVE_EMBED
} from '../../base-action-types'
import {
  ZOPIM_SHOW,
  ZOPIM_CHAT_GONE_OFFLINE
} from 'src/redux/modules/zopimChat/zopimChat-action-types'
import {
  PROACTIVE_CHAT_RECEIVED,
  CHAT_WINDOW_OPEN_ON_NAVIGATE,
  PROACTIVE_CHAT_NOTIFICATION_DISMISSED,
  CHAT_BANNED
} from 'src/redux/modules/chat/chat-action-types'
import { NIL_EMBED } from 'constants/shared'
import { testReducer } from 'src/util/testHelpers'

testReducer(webWidgetVisibility, [
  {
    action: { type: undefined },
    expected: false
  },
  {
    action: { type: 'DERP DERP' },
    initialState: true,
    expected: true
  },
  {
    action: { type: LAUNCHER_CLICKED },
    expected: true
  },
  {
    action: { type: CHAT_BADGE_CLICKED },
    expected: true
  },
  {
    action: { type: ACTIVATE_RECEIVED },
    expected: true
  },
  {
    action: { type: PROACTIVE_CHAT_RECEIVED },
    expected: true
  },
  {
    action: { type: CHAT_WINDOW_OPEN_ON_NAVIGATE },
    expected: true
  },
  {
    action: { type: OPEN_RECEIVED },
    expected: true
  },
  {
    action: { type: ZOPIM_CHAT_GONE_OFFLINE },
    expected: true
  },
  {
    action: { type: CLOSE_BUTTON_CLICKED },
    expected: false
  },
  {
    action: { type: POPOUT_BUTTON_CLICKED },
    expected: false
  },
  {
    action: { type: LEGACY_SHOW_RECEIVED },
    expected: false
  },
  {
    action: { type: CANCEL_BUTTON_CLICKED },
    expected: false
  },
  {
    action: { type: ZOPIM_SHOW },
    expected: false
  },
  {
    action: { type: PROACTIVE_CHAT_NOTIFICATION_DISMISSED },
    expected: false
  },
  {
    action: { type: CHAT_BANNED },
    expected: false
  },
  {
    action: { type: CLOSE_RECEIVED },
    expected: false
  },
  {
    action: { type: TOGGLE_RECEIVED },
    initialState: false,
    expected: true
  },
  {
    action: { type: UPDATE_ACTIVE_EMBED, payload: 'helpCenterForm' },
    initialState: true,
    expected: true
  },
  {
    action: { type: UPDATE_ACTIVE_EMBED, payload: NIL_EMBED },
    initialState: true,
    expected: false
  }
])

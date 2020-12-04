import isChatBadgeMinimized from '../base-is-chat-badge-minimized'
import {
  CHAT_BADGE_MINIMIZED,
  BADGE_SHOW_RECEIVED,
  BADGE_HIDE_RECEIVED
} from '../../base-action-types'
import {
  SDK_CHAT_MSG,
  SDK_CHAT_FILE,
  SDK_CHAT_REQUEST_RATING
} from 'src/redux/modules/chat/chat-action-types'
import { CHAT_MSG_REQUEST_SUCCESS } from 'src/redux/modules/chat/chat-action-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(isChatBadgeMinimized, [
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
    action: { type: CHAT_BADGE_MINIMIZED },
    initialState: false,
    expected: true
  },
  {
    action: { type: CHAT_MSG_REQUEST_SUCCESS },
    initialState: false,
    expected: true
  },
  {
    action: { type: BADGE_HIDE_RECEIVED },
    expected: true
  },
  {
    action: { type: SDK_CHAT_MSG },
    expected: true
  },
  {
    action: { type: SDK_CHAT_REQUEST_RATING },
    expected: true
  },
  {
    action: { type: SDK_CHAT_FILE },
    expected: true
  },
  {
    action: { type: BADGE_SHOW_RECEIVED },
    initialState: true,
    expected: false
  }
])

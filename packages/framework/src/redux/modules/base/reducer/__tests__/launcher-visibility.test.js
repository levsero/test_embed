import {
  PROACTIVE_CHAT_RECEIVED,
  CHAT_WINDOW_OPEN_ON_NAVIGATE,
  PROACTIVE_CHAT_NOTIFICATION_DISMISSED,
  CHAT_BANNED,
} from 'src/redux/modules/chat/chat-action-types'
import * as devices from 'src/util/devices'
import { testReducer } from 'src/util/testHelpers'
import {
  LAUNCHER_CLICKED,
  CHAT_BADGE_CLICKED,
  CLOSE_BUTTON_CLICKED,
  LEGACY_SHOW_RECEIVED,
  ACTIVATE_RECEIVED,
  NEXT_BUTTON_CLICKED,
  CANCEL_BUTTON_CLICKED,
  OPEN_RECEIVED,
  CLOSE_RECEIVED,
  TOGGLE_RECEIVED,
  POPOUT_CREATED,
  ESCAPE_KEY_PRESSED,
} from '../../base-action-types'
import launcherVisibility from '../launcher-visibility'

testReducer(launcherVisibility, [
  {
    action: { type: undefined },
    expected: true,
  },
  {
    action: { type: 'DERP DERP' },
    initialState: false,
    expected: false,
  },
  {
    action: { type: LAUNCHER_CLICKED },
    expected: false,
  },
  {
    action: { type: CHAT_BADGE_CLICKED },
    expected: false,
  },
  {
    action: { type: ACTIVATE_RECEIVED },
    expected: false,
  },
  {
    action: { type: PROACTIVE_CHAT_RECEIVED },
    expected: false,
  },
  {
    action: { type: CHAT_WINDOW_OPEN_ON_NAVIGATE },
    expected: false,
  },
  {
    action: { type: OPEN_RECEIVED },
    expected: false,
  },
  {
    action: { type: CLOSE_BUTTON_CLICKED },
    expected: true,
  },
  {
    action: { type: POPOUT_CREATED },
    expected: true,
  },
  {
    action: { type: LEGACY_SHOW_RECEIVED },
    expected: true,
  },
  {
    action: { type: CANCEL_BUTTON_CLICKED },
    expected: true,
  },
  {
    action: { type: PROACTIVE_CHAT_NOTIFICATION_DISMISSED },
    expected: true,
  },
  {
    action: { type: CHAT_BANNED },
    expected: true,
  },
  {
    action: { type: CLOSE_RECEIVED },
    expected: true,
  },
  {
    action: { type: ESCAPE_KEY_PRESSED },
    expected: true,
  },
  {
    action: { type: TOGGLE_RECEIVED },
    initialState: false,
    expected: true,
  },
])

describe('when the action is NEXT_BUTTON_CLICKED', () => {
  it('returns true if mobile browser', () => {
    jest.spyOn(devices, 'isMobileBrowser').mockReturnValue(true)
    expect(launcherVisibility(undefined, { type: NEXT_BUTTON_CLICKED })).toEqual(true)
  })

  it('returns false if not mobile browser', () => {
    jest.spyOn(devices, 'isMobileBrowser').mockReturnValue(false)
    expect(launcherVisibility(undefined, { type: NEXT_BUTTON_CLICKED })).toEqual(false)
  })
})

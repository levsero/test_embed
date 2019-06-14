import launcherVisibility from '../launcher-visibility';
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
  WIDGET_INITIALISED,
  POPOUT_BUTTON_CLICKED,
} from '../../base-action-types';
import {
  ZOPIM_HIDE,
  ZOPIM_SHOW,
  ZOPIM_ON_CLOSE
} from 'src/redux/modules/zopimChat/zopimChat-action-types';
import {
  PROACTIVE_CHAT_RECEIVED,
  CHAT_WINDOW_OPEN_ON_NAVIGATE,
  PROACTIVE_CHAT_NOTIFICATION_DISMISSED,
  CHAT_BANNED
} from 'src/redux/modules/chat/chat-action-types';
import * as devices from 'utility/devices';
import * as globals from 'utility/globals';
import { testReducer } from 'src/util/testHelpers';

testReducer(launcherVisibility, [
  {
    action: { type: undefined },
    expected: true
  },
  {
    action: { type: 'DERP DERP' },
    initialState: false,
    expected: false
  },
  {
    action: { type: LAUNCHER_CLICKED },
    expected: false
  },
  {
    action: { type: CHAT_BADGE_CLICKED },
    expected: false
  },
  {
    action: { type: ACTIVATE_RECEIVED },
    expected: false
  },
  {
    action: { type: PROACTIVE_CHAT_RECEIVED },
    expected: false
  },
  {
    action: { type: CHAT_WINDOW_OPEN_ON_NAVIGATE },
    expected: false
  },
  {
    action: { type: OPEN_RECEIVED },
    expected: false
  },
  {
    action: { type: CLOSE_BUTTON_CLICKED },
    expected: true
  },
  {
    action: { type: POPOUT_BUTTON_CLICKED },
    expected: true
  },
  {
    action: { type: ZOPIM_HIDE },
    expected: true
  },
  {
    action: { type: LEGACY_SHOW_RECEIVED },
    expected: true
  },
  {
    action: { type: CANCEL_BUTTON_CLICKED },
    expected: true
  },
  {
    action: { type: ZOPIM_ON_CLOSE },
    expected: true
  },
  {
    action: { type: PROACTIVE_CHAT_NOTIFICATION_DISMISSED },
    expected: true
  },
  {
    action: { type: CHAT_BANNED },
    expected: true
  },
  {
    action: { type: CLOSE_RECEIVED },
    expected: true
  },
  {
    action: { type: TOGGLE_RECEIVED },
    initialState: false,
    expected: true
  }
]);

describe('WIDGET_INITIALISED', () => {
  it('returns false if popout', () => {
    jest.spyOn(globals, 'isPopout').mockReturnValue(true);
    expect(launcherVisibility(undefined, { type: WIDGET_INITIALISED })).toEqual(false);
  });

  it('returns true if not popout', () => {
    jest.spyOn(globals, 'isPopout').mockReturnValue(false);
    expect(launcherVisibility(undefined, { type: WIDGET_INITIALISED })).toEqual(true);
  });
});

[ZOPIM_SHOW, NEXT_BUTTON_CLICKED].forEach((type) => {
  describe(type, () => {
    it('returns true if mobile browser', () => {
      jest.spyOn(devices, 'isMobileBrowser').mockReturnValue(true);
      expect(launcherVisibility(undefined, { type: type })).toEqual(true);
    });

    it('returns false if not mobile browser', () => {
      jest.spyOn(devices, 'isMobileBrowser').mockReturnValue(false);
      expect(launcherVisibility(undefined, { type: type })).toEqual(false);
    });
  });
});

import screen from '../talk-screen'
import * as actionTypes from 'src/redux/modules/talk/talk-action-types'
import * as screenTypes from 'src/redux/modules/talk/talk-screen-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(screen, [
  {
    action: { type: undefined },
    expected: screenTypes.CALLBACK_SCREEN
  },
  {
    action: { type: 'DERP DERP' },
    initialState: screenTypes.SUCCESS_NOTIFICATION_SCREEN,
    expected: screenTypes.SUCCESS_NOTIFICATION_SCREEN
  },
  {
    action: {
      type: actionTypes.UPDATE_TALK_SCREEN,
      payload: screenTypes.PHONE_US_SCREEN
    },
    expected: screenTypes.PHONE_US_SCREEN
  },
  {
    action: {
      type: actionTypes.TALK_CALLBACK_SUCCESS
    },
    expected: screenTypes.SUCCESS_NOTIFICATION_SCREEN
  }
])

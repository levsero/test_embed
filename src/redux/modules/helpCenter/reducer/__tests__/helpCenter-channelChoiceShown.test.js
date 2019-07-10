import channelChoiceShown from '../helpCenter-channelChoiceShown'
import * as actionTypes from 'src/redux/modules/helpCenter/helpCenter-action-types'
import { API_CLEAR_HC_SEARCHES } from '../../../base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(channelChoiceShown, [
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
    action: {
      type: actionTypes.CHANNEL_CHOICE_SCREEN_CHANGE_INTENT_SHOWN,
      payload: true
    },
    expected: true
  },
  {
    action: {
      type: actionTypes.CHANNEL_CHOICE_SCREEN_CHANGE_INTENT_SHOWN,
      payload: false
    },
    initialState: true,
    expected: false
  },
  {
    action: { type: API_CLEAR_HC_SEARCHES },
    initialState: true,
    expected: false
  }
])

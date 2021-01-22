import { testReducer } from 'utility/testHelpers'
import { CALL_FAILED, END_CALL, START_CALL } from 'embeds/talk/actions/action-types'

import callInProgressLabel from '../call-in-progress-label'

testReducer(callInProgressLabel, [
  {
    action: { type: 'something unrelated' },
    initialState: 'Call in progress',
    expected: 'Call in progress'
  },
  {
    action: { type: END_CALL },
    initialState: 'Call in progress',
    expected: 'Call ended'
  },
  {
    action: { type: CALL_FAILED },
    initialState: 'Call in progress',
    expected: 'Call failed'
  },
  {
    action: { type: START_CALL },
    initialState: 'Call failed',
    expected: 'Call in progress'
  }
])

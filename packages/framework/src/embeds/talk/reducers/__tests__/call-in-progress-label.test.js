import { testReducer } from 'utility/testHelpers'
import { CALL_FAILED, END_CALL, START_CALL } from 'embeds/talk/actions/action-types'

import callInProgressLabel from '../call-in-progress-label'

testReducer(callInProgressLabel, [
  {
    action: { type: 'something unrelated' },
    initialState: 'embeddable_framework.talk.embeddedVoice.call_in_progress',
    expected: 'embeddable_framework.talk.embeddedVoice.call_in_progress'
  },
  {
    action: { type: END_CALL },
    initialState: 'embeddable_framework.talk.embeddedVoice.call_in_progress',
    expected: 'embeddable_framework.talk.embeddedVoice.call.ended'
  },
  {
    action: { type: CALL_FAILED },
    initialState: 'embeddable_framework.talk.embeddedVoice.call_in_progress',
    expected: 'embeddable_framework.talk.embeddedVoice.callErrors.callFailed'
  },
  {
    action: { type: START_CALL },
    initialState: 'embeddable_framework.talk.embeddedVoice.callErrors.callFailed',
    expected: 'embeddable_framework.talk.embeddedVoice.call_in_progress'
  }
])

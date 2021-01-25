import { testReducer } from 'utility/testHelpers'
import { CALL_FAILED, CALL_ENDED, CALL_STARTED } from 'embeds/talk/actions/action-types'

import callInProgressLabel from '../call-in-progress-label'

testReducer(callInProgressLabel, [
  {
    action: { type: 'something unrelated' },
    initialState: 'embeddable_framework.talk.embeddedVoice.call_in_progress',
    expected: 'embeddable_framework.talk.embeddedVoice.call_in_progress'
  },
  {
    action: { type: CALL_ENDED },
    initialState: 'embeddable_framework.talk.embeddedVoice.call_in_progress',
    expected: 'embeddable_framework.talk.embeddedVoice.call.ended'
  },
  {
    action: { type: CALL_FAILED },
    initialState: 'embeddable_framework.talk.embeddedVoice.call_in_progress',
    expected: 'embeddable_framework.talk.embeddedVoice.callErrors.callFailed'
  },
  {
    action: { type: CALL_STARTED },
    initialState: 'embeddable_framework.talk.embeddedVoice.callErrors.callFailed',
    expected: 'embeddable_framework.talk.embeddedVoice.call_in_progress'
  }
])

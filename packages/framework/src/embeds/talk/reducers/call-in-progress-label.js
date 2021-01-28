import { CALL_FAILED, END_CALL, START_CALL } from 'embeds/talk/actions/action-types'

const callInProgressLabel = (
  state = 'embeddable_framework.talk.embeddedVoice.call_in_progress',
  action = {}
) => {
  const { type } = action

  switch (type) {
    case START_CALL:
      return 'embeddable_framework.talk.embeddedVoice.call_in_progress'
    case END_CALL:
      return 'embeddable_framework.talk.embeddedVoice.call.ended'
    case CALL_FAILED:
      return 'embeddable_framework.talk.embeddedVoice.callErrors.callFailed'
    default:
      return state
  }
}

export default callInProgressLabel

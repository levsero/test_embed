import { CALL_FAILED, CALL_ENDED, CALL_STARTED } from 'embeds/talk/actions/action-types'

const callInProgressLabel = (
  state = 'embeddable_framework.talk.embeddedVoice.call_in_progress',
  action = {}
) => {
  const { type } = action

  switch (type) {
    case CALL_STARTED:
      return 'embeddable_framework.talk.embeddedVoice.call_in_progress'
    case CALL_ENDED:
      return 'embeddable_framework.talk.embeddedVoice.call.ended'
    case CALL_FAILED:
      return 'embeddable_framework.talk.embeddedVoice.callErrors.callFailed'
    default:
      return state
  }
}

export default callInProgressLabel

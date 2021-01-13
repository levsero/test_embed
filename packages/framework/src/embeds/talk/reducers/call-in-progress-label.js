import { CALL_FAILED, END_CALL, START_CALL } from 'embeds/talk/actions/action-types'

const callInProgressLabel = (state = 'Call in progress', action = {}) => {
  const { type } = action

  switch (type) {
    case START_CALL:
      return 'Call in progress'
    case END_CALL:
      return 'Call ended'
    case CALL_FAILED:
      return 'Call failed'
    default:
      return state
  }
}

export default callInProgressLabel

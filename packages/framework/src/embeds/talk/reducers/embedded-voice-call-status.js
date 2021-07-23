import {
  CALL_STARTED,
  CALL_ENDED,
  CALL_FAILED,
  RESET_CALL_FAILED,
} from 'src/embeds/talk/actions/action-types'

const initialState = {
  isCallInProgress: false,
  hasLastCallFailed: false,
}

const embeddedVoiceCallStatus = (state = initialState, action = {}) => {
  const { type } = action

  switch (type) {
    case CALL_STARTED:
      return {
        isCallInProgress: true,
        hasLastCallFailed: false,
      }
    case CALL_ENDED:
      return {
        ...state,
        isCallInProgress: false,
      }
    case CALL_FAILED:
      return {
        ...state,
        hasLastCallFailed: true,
      }
    case RESET_CALL_FAILED:
      return {
        ...state,
        hasLastCallFailed: false,
      }
    default:
      return state
  }
}

export default embeddedVoiceCallStatus

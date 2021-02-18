import {
  MICROPHONE_MUTED,
  MICROPHONE_UNMUTED,
  RECORDING_CONSENT_ACCEPTED,
  RECORDING_CONSENT_DENIED,
  CALL_ENDED,
  CALL_FAILED,
  CALL_STARTED,
  RESET_CALL_FAILED,
  INCREMENT_CALL_TIMER,
} from './action-types'

let callInterval

const startCallCounter = () => (dispatch) => {
  if (!callInterval) {
    callInterval = setInterval(() => {
      dispatch({ type: INCREMENT_CALL_TIMER })
    }, 1000)
  }
}

const stopCallCounter = () => {
  clearInterval(callInterval)
  callInterval = null
}

export const muteMicrophone = () => ({
  type: MICROPHONE_MUTED,
})

export const unmuteMicrophone = () => ({
  type: MICROPHONE_UNMUTED,
})

export const acceptRecordingConsent = () => ({
  type: RECORDING_CONSENT_ACCEPTED,
})
export const declineRecordingConsent = () => ({
  type: RECORDING_CONSENT_DENIED,
})

export const callStarted = () => (dispatch) => {
  dispatch({ type: CALL_STARTED })
  dispatch(startCallCounter())
}

export const callEnded = () => (dispatch) => {
  dispatch({ type: CALL_ENDED })
  stopCallCounter()
}

export const callFailed = () => (dispatch) => {
  dispatch({ type: CALL_FAILED })
  stopCallCounter()
}

export const resetCallFailed = () => ({
  type: RESET_CALL_FAILED,
})

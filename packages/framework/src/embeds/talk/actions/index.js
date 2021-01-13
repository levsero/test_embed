import {
  MICROPHONE_MUTED,
  MICROPHONE_UNMUTED,
  RECORDING_CONSENT_ACCEPTED,
  RECORDING_CONSENT_DENIED,
  END_CALL,
  CALL_FAILED,
  START_CALL,
  INCREMENT_CALL_TIMER
} from './action-types'

let callInterval

const startCallCounter = () => dispatch => {
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
  type: MICROPHONE_MUTED
})

export const unmuteMicrophone = () => ({
  type: MICROPHONE_UNMUTED
})

export const acceptRecordingConsent = () => ({
  type: RECORDING_CONSENT_ACCEPTED
})
export const declineRecordingConsent = () => ({
  type: RECORDING_CONSENT_DENIED
})

export const startCall = () => dispatch => {
  dispatch({ type: START_CALL })
  dispatch(startCallCounter())
}

export const endCall = () => dispatch => {
  dispatch({ type: END_CALL })
  stopCallCounter()
}

export const failCall = () => dispatch => {
  dispatch({ type: CALL_FAILED })
  stopCallCounter()
}

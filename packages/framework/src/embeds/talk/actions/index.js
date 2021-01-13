import {
  MICROPHONE_MUTED,
  MICROPHONE_UNMUTED,
  RECORDING_CONSENT_ACCEPTED,
  RECORDING_CONSENT_DENIED,
  END_CALL,
  START_CALL,
  INCREMENT_CALL_TIMER
} from './action-types'

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

let callInterval

export const startCallCounter = () => dispatch => {
  if (!callInterval) {
    dispatch({ type: START_CALL })
    callInterval = setInterval(() => {
      dispatch({ type: INCREMENT_CALL_TIMER })
    }, 1000)
  }
}

export const stopCallCounter = () => dispatch => {
  dispatch({ type: END_CALL })
  clearInterval(callInterval)
  callInterval = null
}

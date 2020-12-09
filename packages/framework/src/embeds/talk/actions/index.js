import {
  MICROPHONE_MUTED,
  MICROPHONE_UNMUTED,
  RECORDING_CONSENT_ACCEPTED,
  RECORDING_CONSENT_DENIED
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

import { MICROPHONE_MUTED, MICROPHONE_UNMUTED } from './action-types'

export const muteMicrophone = () => ({
  type: MICROPHONE_MUTED
})

export const unmuteMicrophone = () => ({
  type: MICROPHONE_UNMUTED
})

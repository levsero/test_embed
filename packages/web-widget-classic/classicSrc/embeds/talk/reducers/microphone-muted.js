import { MICROPHONE_MUTED, MICROPHONE_UNMUTED } from 'classicSrc/embeds/talk/actions/action-types'

const initialState = false

const microphoneMuted = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case MICROPHONE_MUTED:
      return true
    case MICROPHONE_UNMUTED:
      return false
    default:
      return state
  }
}

export default microphoneMuted

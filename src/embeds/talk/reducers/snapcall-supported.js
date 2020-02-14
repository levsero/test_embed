import { SET_SNAPCALL_SUPPORTED } from 'src/embeds/talk/actions/action-types'

const snapcallSupported = (state = null, action = {}) => {
  const { type, payload } = action

  switch (type) {
    case SET_SNAPCALL_SUPPORTED:
      return payload.snapcallSupported
    default:
      return state
  }
}

export default snapcallSupported

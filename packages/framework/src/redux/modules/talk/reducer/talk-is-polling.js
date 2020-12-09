import { TALK_VENDOR_LOADED } from '../talk-action-types'

const initialState = true

const isPolling = (state = initialState, action = {}) => {
  const { type } = action

  switch (type) {
    case TALK_VENDOR_LOADED:
      return false
    default:
      return state
  }
}

export default isPolling

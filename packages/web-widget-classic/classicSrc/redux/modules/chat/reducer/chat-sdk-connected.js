import { CHAT_CONNECTED } from '../chat-action-types'

const initialState = false

export default function sdkConnected(state = initialState, action) {
  switch (action.type) {
    case CHAT_CONNECTED:
      return true
    default:
      return state
  }
}

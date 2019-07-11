import { CHAT_BANNED } from '../chat-action-types'

const initialState = false

const chatBanned = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_BANNED:
      return true
    default:
      return state
  }
}

export default chatBanned

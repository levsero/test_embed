import { DEFER_CHAT_SETUP, BEGIN_CHAT_SETUP } from 'src/embeds/chat/actions/action-types'

const deferredChatIsPolling = (state = false, action) => {
  switch (action.type) {
    case DEFER_CHAT_SETUP:
      return true
    case BEGIN_CHAT_SETUP:
      return false
    default:
      return state
  }
}

export default deferredChatIsPolling

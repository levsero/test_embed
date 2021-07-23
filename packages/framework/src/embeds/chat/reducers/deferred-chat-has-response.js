import { RECEIVE_DEFERRED_CHAT_STATUS } from 'src/embeds/chat/actions/action-types'

const deferredChatHasResponse = (state = false, action) => {
  switch (action.type) {
    case RECEIVE_DEFERRED_CHAT_STATUS:
      return true

    default:
      return state
  }
}

export default deferredChatHasResponse

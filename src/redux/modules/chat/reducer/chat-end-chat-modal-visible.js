import { UPDATE_END_CHAT_MODAL_VISIBILITY } from '../chat-action-types'

const endChatModalVisible = (state = false, action) => {
  switch (action.type) {
    case UPDATE_END_CHAT_MODAL_VISIBILITY:
      return action.payload.isVisible
    default:
      return state
  }
}

export default endChatModalVisible

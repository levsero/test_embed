import { CHAT_CONNECTED } from 'classicSrc/redux/modules/chat/chat-action-types'

// chatLogBackfillCompleted is used to prevent web widget apis being called while the chat sdk
// is currently provided us with events to backfill the chat log.
const chatLogBackfillCompleted = (state = false, action) => {
  if (action.type === CHAT_CONNECTED) {
    return true
  }

  return state
}

export default chatLogBackfillCompleted

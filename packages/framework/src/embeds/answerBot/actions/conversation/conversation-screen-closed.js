import { CONVERSATION_SCREEN_CLOSED } from './action-types'

export const conversationScreenClosed = () => {
  return {
    type: CONVERSATION_SCREEN_CLOSED,
    payload: Date.now(),
  }
}

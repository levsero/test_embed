import { CONVERSATION_SCROLL_CHANGED } from './action-types'

export const conversationScrollChanged = (scrollTop) => {
  return {
    type: CONVERSATION_SCROLL_CHANGED,
    payload: scrollTop,
  }
}

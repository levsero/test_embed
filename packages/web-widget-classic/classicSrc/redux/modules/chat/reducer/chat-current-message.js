import {
  CHAT_BOX_CHANGED,
  RESET_CURRENT_MESSAGE,
  PRE_CHAT_FORM_ON_CHANGE,
  CHAT_BADGE_MESSAGE_CHANGED,
  CHAT_BANNED,
  PRE_CHAT_FORM_SUBMIT,
} from '../chat-action-types'

const initialState = ''

const currentMessage = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_BADGE_MESSAGE_CHANGED:
    case CHAT_BOX_CHANGED:
      return action.payload
    case PRE_CHAT_FORM_ON_CHANGE:
      return action.payload.message || ''
    case CHAT_BANNED:
    case RESET_CURRENT_MESSAGE:
    case PRE_CHAT_FORM_SUBMIT:
      return initialState
    default:
      return state
  }
}

export default currentMessage

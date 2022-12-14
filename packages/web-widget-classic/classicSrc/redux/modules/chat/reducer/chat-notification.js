import {
  CHAT_NOTIFICATION_DISMISSED,
  CHAT_NOTIFICATION_RESET,
  NEW_AGENT_MESSAGE_RECEIVED,
  PROACTIVE_CHAT_NOTIFICATION_DISMISSED,
  CHAT_OPENED,
  CHAT_BANNED,
} from '../chat-action-types'

const initialState = {
  nick: '',
  display_name: '',
  msg: '',
  show: false,
  count: 0,
  proactive: false,
}

const notification = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_NOTIFICATION_DISMISSED:
    case PROACTIVE_CHAT_NOTIFICATION_DISMISSED:
      return { ...state, show: false }
    case NEW_AGENT_MESSAGE_RECEIVED:
      // eslint-disable-next-line babel/camelcase
      const { proactive, nick, display_name, msg } = action.payload

      return {
        ...state,
        nick,
        display_name,
        proactive,
        msg,
        show: true,
        count: state.count + 1,
      }
    case CHAT_OPENED:
    case CHAT_NOTIFICATION_RESET:
      return { ...state, show: false, count: 0 }
    case CHAT_BANNED:
      return initialState
    default:
      return state
  }
}

export default notification

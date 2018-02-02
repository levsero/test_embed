import { SDK_CHAT_MSG,
         HIDE_CHAT_NOTIFICATION,
         NEW_AGENT_MESSAGE_RECEIVED,
         CHAT_OPENED } from '../chat-action-types';

const initialState = {
  nick: '',
  display_name: '',
  msg: '',
  show: false,
  count: 0
};

const notification = (state = initialState, action) => {
  switch (action.type) {
    case SDK_CHAT_MSG:
      const { nick, display_name, msg } = action.payload.detail;

      return {
        ...state,
        nick,
        display_name,
        msg,
        show: true
      };
    case HIDE_CHAT_NOTIFICATION:
      return { ...state, show: false };
    case NEW_AGENT_MESSAGE_RECEIVED:
      return { ...state, count: state.count + 1 };
    case CHAT_OPENED:
      return { ...state, count: 0 };
    default:
      return state;
  }
};

export default notification;

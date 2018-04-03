import { CHAT_NOTIFICATION_DISMISSED,
         NEW_AGENT_MESSAGE_RECEIVED,
         INCREMENT_NEW_AGENT_MESSAGE_COUNTER,
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
    case CHAT_NOTIFICATION_DISMISSED:
      return { ...state, show: false };
    case NEW_AGENT_MESSAGE_RECEIVED:
      const { nick, display_name, msg } = action.payload;

      return {
        ...state,
        nick,
        display_name,
        msg,
        show: true
      };
    case INCREMENT_NEW_AGENT_MESSAGE_COUNTER:
      return { ...state, count: state.count + 1 };
    case CHAT_OPENED:
      return { ...state, show: false, count: 0 };
    default:
      return state;
  }
};

export default notification;

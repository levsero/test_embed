import { CHAT_NOTIFICATION_DISMISSED,
  NEW_AGENT_MESSAGE_RECEIVED,
  CHAT_OPENED } from '../chat-action-types';

const initialState = {
  nick: '',
  display_name: '',
  msg: '',
  show: false,
  count: 0,
  proactive: false
};

const notification = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_NOTIFICATION_DISMISSED:
      return { ...state, show: false };
    case NEW_AGENT_MESSAGE_RECEIVED:
      const { proactive, nick, display_name, msg } = action.payload; // eslint-disable-line camelcase

      return {
        ...state,
        nick,
        display_name,
        proactive,
        msg,
        show: true,
        count: state.count + 1
      };
    case CHAT_OPENED:
      return { ...state, show: false, count: 0 };
    default:
      return state;
  }
};

export default notification;

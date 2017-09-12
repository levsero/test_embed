import { SDK_CHAT_MSG, HIDE_CHAT_NOTIFICATION } from '../chat-action-types';

const initialState = {
  nick: '',
  display_name: '',
  msg: '',
  show: false
};

const notification = (state = initialState, action) => {
  switch (action.type) {
    case SDK_CHAT_MSG:
      const { nick, display_name, msg } = action.payload.detail;

      return {
        nick,
        display_name,
        msg,
        show: true
      };
    case HIDE_CHAT_NOTIFICATION:
      return { ...state, show: false };
    default:
      return state;
  }
};

export default notification;

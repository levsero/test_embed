import { SDK_CHAT_MSG, HIDE_CHAT_NOTIFICATION, TOGGLE_CHAT_NOTIFICATION_SOUND } from '../chat-action-types';

const initialState = {
  nick: '',
  display_name: '',
  msg: '',
  show: false,
  playSound: false
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
    case TOGGLE_CHAT_NOTIFICATION_SOUND:
      return { ...state, playSound: action.payload };
    default:
      return state;
  }
};

export default notification;

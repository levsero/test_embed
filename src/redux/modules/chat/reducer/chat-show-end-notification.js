import { SHOW_END_CHAT_NOTIFICATION, HIDE_END_CHAT_NOTIFICATION } from '../chat-action-types';

const initialState = false;

const showEndChatNotification = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_END_CHAT_NOTIFICATION:
      return true;
    case HIDE_END_CHAT_NOTIFICATION:
      return false;
    default:
      return state;
  }
};

export default showEndChatNotification;

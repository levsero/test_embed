import { CHAT_NOTIFICATION_DISMISSED,
  CHAT_NOTIFICATION_RESPONDED,
  SHOW_STANDALONE_MOBILE_NOTIFICATION } from '../chat-action-types';

const initialState = false;

const standaloneMobileNotificationVisible = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_NOTIFICATION_DISMISSED:
    case CHAT_NOTIFICATION_RESPONDED:
      return false;
    case SHOW_STANDALONE_MOBILE_NOTIFICATION:
      return true;
    default:
      return state;
  }
};

export default standaloneMobileNotificationVisible;

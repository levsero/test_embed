import { CHAT_NOTIFICATION_DISMISSED,
         CHAT_NOTIFICATION_RESPONDED,
         NEW_AGENT_MESSAGE_RECEIVED } from '../chat-action-types';

const initialState = false;

const standaloneMobileNotificationVisible = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_NOTIFICATION_DISMISSED:
    case CHAT_NOTIFICATION_RESPONDED:
      return false;
    case NEW_AGENT_MESSAGE_RECEIVED:
      return action.payload.proactive;
    default:
      return state;
  }
};

export default standaloneMobileNotificationVisible;

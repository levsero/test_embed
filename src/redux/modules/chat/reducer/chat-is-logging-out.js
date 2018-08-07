import { CHAT_USER_LOGGING_OUT, CHAT_USER_LOGGED_OUT } from '../chat-action-types';

const initialState = false;

export default function isLoggingOut(state = initialState, action) {
  switch (action.type) {
    case CHAT_USER_LOGGING_OUT:
      return true;
    case CHAT_USER_LOGGED_OUT:
      return false;
    default:
      return state;
  }
}

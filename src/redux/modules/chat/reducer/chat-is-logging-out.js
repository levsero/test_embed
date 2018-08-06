import { USER_LOGGING_OUT, USER_LOGGED_OUT } from '../chat-action-types';

const initialState = false;

export default function isLoggingOut(state=initialState, action) {
  switch (action.type) {
    case USER_LOGGING_OUT:
      return true;
    case USER_LOGGED_OUT:
      return false;
    default:
      return state;
  }
}

import {
  OPENED_CHAT_HISTORY,
  CLOSED_CHAT_HISTORY
} from '../chat-action-types';

const initialState = false ;

const showChatHistory = (state = initialState, action = {}) => {
  const { type } = action;

  switch (type) {
    case OPENED_CHAT_HISTORY:
      return true;
    case CLOSED_CHAT_HISTORY:
      return false;
    default:
      return state;
  }
};

export default showChatHistory;

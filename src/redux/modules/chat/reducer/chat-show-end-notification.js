import { TOGGLE_END_CHAT_NOTIFICATION } from '../chat-action-types';

const initialState = false;

const showEndChatNotification = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case TOGGLE_END_CHAT_NOTIFICATION:
      return payload;
    default:
      return state;
  }
};

export default showEndChatNotification;

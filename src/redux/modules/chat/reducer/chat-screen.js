import { UPDATE_CHAT_SCREEN, CHAT_NOTIFICATION_RESPONDED } from '../chat-action-types';
import { CHATTING_SCREEN } from '../chat-screen-types';

const initialState = CHATTING_SCREEN;

const screen = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CHAT_SCREEN:
      return action.payload.screen;
    case CHAT_NOTIFICATION_RESPONDED:
      return CHATTING_SCREEN;
    default:
      return state;
  }
};

export default screen;

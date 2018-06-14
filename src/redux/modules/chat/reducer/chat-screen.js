import { UPDATE_CHAT_SCREEN,
  CHAT_NOTIFICATION_RESPONDED,
  SDK_CHAT_MEMBER_JOIN,
  UPDATE_PREVIEWER_SCREEN,
  PRE_CHAT_FORM_SUBMIT } from '../chat-action-types';
import { CHATTING_SCREEN } from '../chat-screen-types';

const initialState = CHATTING_SCREEN;

const screen = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CHAT_SCREEN:
      return action.payload.screen;
    case CHAT_NOTIFICATION_RESPONDED:
    case SDK_CHAT_MEMBER_JOIN:
    case PRE_CHAT_FORM_SUBMIT:
      return CHATTING_SCREEN;
    case UPDATE_PREVIEWER_SCREEN:
      return action.payload.screen;
    default:
      return state;
  }
};

export default screen;

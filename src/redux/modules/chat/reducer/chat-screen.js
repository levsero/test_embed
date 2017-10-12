import { UPDATE_CHAT_SCREEN } from '../chat-action-types';
import { CHATTING_SCREEN } from './chat-screen-types';

const initialState = CHATTING_SCREEN;

const screen = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CHAT_SCREEN:
      return action.payload.screen;
    default:
      return state;
  }
};

export default screen;

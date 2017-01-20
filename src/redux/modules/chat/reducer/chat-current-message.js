import { UPDATE_CHAT_MSG } from '../chat-action-types';

const initialState = null;

const currentMessage  = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CHAT_MSG:
      return action.payload;
    default:
      return state;
  }
}

export default currentMessage;

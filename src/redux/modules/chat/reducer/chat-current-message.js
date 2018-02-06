import { CHAT_BOX_CHANGED } from '../chat-action-types';

const initialState = '';

const currentMessage = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_BOX_CHANGED:
      return action.payload;
    default:
      return state;
  }
};

export default currentMessage;

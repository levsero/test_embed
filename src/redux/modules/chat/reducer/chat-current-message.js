import { UPDATE_CURRENT_MSG } from '../chat-action-types';

const initialState = '';

const currentMessage = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CURRENT_MSG:
      return action.payload;
    default:
      return state;
  }
}

export default currentMessage;

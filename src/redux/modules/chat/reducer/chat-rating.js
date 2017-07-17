import { SEND_CHAT_RATING_SUCCESS } from '../chat-action-types';

const initialState = null;

const rating = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case SEND_CHAT_RATING_SUCCESS:
      return payload;
    default:
      return state;
  }
};

export default rating;

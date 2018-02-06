import { CHAT_RATING_REQUEST_SUCCESS } from '../chat-action-types';
import { ChatRatings } from 'component/chat/ChatRatingGroup';

const initialState = ChatRatings.NOT_SET;

const rating = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case CHAT_RATING_REQUEST_SUCCESS:
      return payload;
    default:
      return state;
  }
};

export default rating;

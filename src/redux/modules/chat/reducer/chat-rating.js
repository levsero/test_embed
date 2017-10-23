import { SEND_CHAT_RATING_SUCCESS } from '../chat-action-types';
import { ChatRatings } from '../../../../../src/component/chat/ChatRatingGroup';

const initialState = ChatRatings.NOT_SET;

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

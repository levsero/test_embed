import { CHAT_RATING_REQUEST_SUCCESS,
         CHAT_RATING_COMMENT_REQUEST_SUCCESS,
         END_CHAT_REQUEST_SUCCESS } from '../chat-action-types';
import { ChatRatings } from 'component/chat/ChatRatingGroup';

const initialState = { value: ChatRatings.NOT_SET };

const rating = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case CHAT_RATING_REQUEST_SUCCESS:
      return {
        value: payload,
        comment: null
      };
    case CHAT_RATING_COMMENT_REQUEST_SUCCESS:
      return {
        ...state,
        comment: payload
      };
    case END_CHAT_REQUEST_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

export default rating;

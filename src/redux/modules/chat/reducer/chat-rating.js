import { CHAT_RATING_REQUEST_SUCCESS,
  CHAT_RATING_COMMENT_REQUEST_SUCCESS,
  END_CHAT_REQUEST_SUCCESS,
  CHAT_RECONNECT,
  UPDATE_PREVIEWER_SCREEN } from '../chat-action-types';
import { ChatRatings } from 'component/chat/ChatRatingGroup';

const initialState = {
  value: ChatRatings.NOT_SET,
  disableEndScreen: false,
  comment: null
};

const rating = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case CHAT_RATING_REQUEST_SUCCESS:
      return {
        ...state,
        value: payload,
        comment: null
      };
    case CHAT_RATING_COMMENT_REQUEST_SUCCESS:
      return {
        ...state,
        comment: payload
      };
    case UPDATE_PREVIEWER_SCREEN:
      return {
        ...state,
        disableEndScreen: true
      };
    case END_CHAT_REQUEST_SUCCESS:
    case CHAT_RECONNECT:
      return initialState;
    default:
      return state;
  }
};

export default rating;

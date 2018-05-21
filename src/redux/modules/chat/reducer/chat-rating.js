import { CHAT_RATING_REQUEST_SUCCESS,
  CHAT_RATING_COMMENT_REQUEST_SUCCESS,
  END_CHAT_REQUEST_SUCCESS,
  CHAT_RECONNECT,
  UPDATE_PREVIEWER_SCREEN,
  SDK_CHAT_MEMBER_LEAVE,
  SDK_CHAT_RATING,
  SDK_CHAT_COMMENT } from '../chat-action-types';
import { isAgent } from 'src/util/chat';
import { ratings } from 'component/chat/rating/RatingGroup';

const initialState = {
  value: ratings.NOT_SET,
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
    case SDK_CHAT_RATING:
      return {
        ...state,
        value: payload.detail.new_rating,
        comment: null
      };
    case CHAT_RATING_COMMENT_REQUEST_SUCCESS:
      return {
        ...state,
        comment: payload
      };
    case SDK_CHAT_COMMENT:
      return {
        ...state,
        comment: payload.detail.new_comment
      };
    case UPDATE_PREVIEWER_SCREEN:
      return {
        ...state,
        disableEndScreen: true
      };
    case SDK_CHAT_MEMBER_LEAVE:
      if (!isAgent(payload.detail.nick)) {
        return initialState;
      }
      return state;
    case END_CHAT_REQUEST_SUCCESS:
    case CHAT_RECONNECT:
      return initialState;
    default:
      return state;
  }
};

export default rating;

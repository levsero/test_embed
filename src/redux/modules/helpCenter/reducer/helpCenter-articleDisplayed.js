import {
  GET_ARTICLE_REQUEST_SENT,
  GET_ARTICLE_REQUEST_SUCCESS,
  GET_ARTICLE_REQUEST_FAILURE
} from '../helpCenter-action-types';

const initialState = false;

const articleDisplayed = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case GET_ARTICLE_REQUEST_FAILURE:
    case GET_ARTICLE_REQUEST_SENT:
      return false;
    case GET_ARTICLE_REQUEST_SUCCESS:
      return true;
    default:
      return state;
  }
};

export default articleDisplayed;

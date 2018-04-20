import {
  CONTEXTUAL_SEARCH_REQUEST_SENT,
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_FAILURE,
  SEARCH_REQUEST_SENT,
  SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_FAILURE,
  GET_ARTICLE_REQUEST_SENT,
  GET_ARTICLE_REQUEST_SUCCESS,
  GET_ARTICLE_REQUEST_FAILURE
} from '../helpCenter-action-types';

const initialState = false;

const loading = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case SEARCH_REQUEST_SENT:
    case CONTEXTUAL_SEARCH_REQUEST_SENT:
    case GET_ARTICLE_REQUEST_SENT:
      return true;
    case SEARCH_REQUEST_SUCCESS:
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
    case GET_ARTICLE_REQUEST_SUCCESS:
    case SEARCH_REQUEST_FAILURE:
    case CONTEXTUAL_SEARCH_REQUEST_FAILURE:
    case GET_ARTICLE_REQUEST_FAILURE:
      return false;
    default:
      return state;
  }
};

export default loading;

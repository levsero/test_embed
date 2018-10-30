import {
  GET_ARTICLE_REQUEST_SENT,
  GET_ARTICLE_REQUEST_SUCCESS,
  GET_ARTICLE_REQUEST_FAILURE
} from '../helpCenter-action-types';
import { API_CLEAR_HC_SEARCHES } from '../../base/base-action-types';

const initialState = false;

const articleDisplayed = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case API_CLEAR_HC_SEARCHES:
    case GET_ARTICLE_REQUEST_FAILURE:
    case GET_ARTICLE_REQUEST_SENT:
      return initialState;
    case GET_ARTICLE_REQUEST_SUCCESS:
      return true;
    default:
      return state;
  }
};

export default articleDisplayed;

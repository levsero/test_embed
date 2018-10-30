import {
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_SENT,
  CONTEXTUAL_SEARCH_REQUEST_FAILURE,
  SEARCH_REQUEST_SUCCESS
} from '../helpCenter-action-types';
import { API_CLEAR_HC_SEARCHES } from '../../base/base-action-types';

const initialState = {
  hasSearched: false,
  screen: ''
};

const contextualSearch = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CONTEXTUAL_SEARCH_REQUEST_SENT:
      return {
        hasSearched: true,
        screen: type
      };
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
    case CONTEXTUAL_SEARCH_REQUEST_FAILURE:
      return {
        ...state,
        screen: type
      };
    case API_CLEAR_HC_SEARCHES:
    case SEARCH_REQUEST_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

export default contextualSearch;

import {
  SEARCH_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_FAILURE,
  CONTEXTUAL_SEARCH_REQUEST_SENT,
  SEARCH_REQUEST_FAILURE,
  SEARCH_REQUEST_SENT
} from '../helpCenter-action-types';
import { API_CLEAR_HC_SEARCHES } from '../../base/base-action-types';

const initialState = {
  current: '',
  previous: '' // Used to display the correct term in noResults when you enter a new search term
};

const searchTerm = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_REQUEST_SUCCESS:
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
    case SEARCH_REQUEST_FAILURE:
    case CONTEXTUAL_SEARCH_REQUEST_FAILURE:
      return {
        ...state,
        previous: state.current
      };
    case SEARCH_REQUEST_SENT:
    case CONTEXTUAL_SEARCH_REQUEST_SENT:
      return {
        ...state,
        current: payload.searchTerm
      };
    case API_CLEAR_HC_SEARCHES:
      return initialState;
    default:
      return state;
  }
};

export default searchTerm;

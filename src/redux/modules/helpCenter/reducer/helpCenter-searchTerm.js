import {
  SEARCH_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS_NO_RESULTS,
  SEARCH_BAR_CHANGED,
  SEARCH_REQUEST_FAILURE
} from '../helpCenter-action-types';

const initialState = {
  current: '',
  previous: '' // Used to display the correct term in noResults when you enter a new search term
};

const searchTerm = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_REQUEST_SUCCESS:
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS_NO_RESULTS:
    case SEARCH_REQUEST_FAILURE:
      return {
        ...state,
        previous: state.current
      };
    case SEARCH_BAR_CHANGED:
      return {
        ...state,
        current: payload
      };
    default:
      return state;
  }
};

export default searchTerm;

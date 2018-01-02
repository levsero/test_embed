import {
  SEARCH_SUCCESS,
  CONTEXTUAL_SEARCH_SUCCESS,
  CONTEXTUAL_SEARCH_SUCCESS_NO_RESULTS,
  UPDATE_SEARCH_TERM,
  SEARCH_FAILURE
} from '../helpCenter-action-types';

const initialState = {
  current: '',
  previous: '' // Used to display the correct term in noResults when you enter a new search term
};

const searchTerm = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_SUCCESS:
    case CONTEXTUAL_SEARCH_SUCCESS:
    case CONTEXTUAL_SEARCH_SUCCESS_NO_RESULTS:
    case SEARCH_FAILURE:
      return {
        ...state,
        previous: state.current
      };
    case UPDATE_SEARCH_TERM:
      return {
        ...state,
        current: payload
      };
    default:
      return state;
  }
};

export default searchTerm;

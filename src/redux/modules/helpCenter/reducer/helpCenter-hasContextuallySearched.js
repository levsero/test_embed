import {
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS_NO_RESULTS,
  SEARCH_REQUEST_SUCCESS
} from '../helpCenter-action-types';

const initialState = false;

const hasContextuallySearched = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
      return true;
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS_NO_RESULTS:
    case SEARCH_REQUEST_SUCCESS:
      return false;
    default:
      return state;
  }
};

export default hasContextuallySearched;

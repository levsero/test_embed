import {
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_SUCCESS
} from '../helpCenter-action-types';

const initialState = false;

const hasContextuallySearched = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
      return true;
    case SEARCH_REQUEST_SUCCESS:
      return false;
    default:
      return state;
  }
};

export default hasContextuallySearched;

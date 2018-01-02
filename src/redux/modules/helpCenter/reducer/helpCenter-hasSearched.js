import {
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  CONTEXTUAL_SEARCH_SUCCESS,
  CONTEXTUAL_SEARCH_SUCCESS_NO_RESULTS } from '../helpCenter-action-types';

const initialState = false;

const hasSearched = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CONTEXTUAL_SEARCH_SUCCESS:
    case SEARCH_SUCCESS:
    case SEARCH_FAILURE:
      return true;
    case CONTEXTUAL_SEARCH_SUCCESS_NO_RESULTS:
      return false;
    default:
      return state;
  }
};

export default hasSearched;

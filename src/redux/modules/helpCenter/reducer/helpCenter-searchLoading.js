import {
  CONTEXTUAL_SEARCH_REQUEST,
  CONTEXTUAL_SEARCH_SUCCESS,
  CONTEXTUAL_SEARCH_SUCCESS_NO_RESULTS,
  SEARCH_REQUEST,
  SEARCH_SUCCESS,
  SEARCH_FAILURE
 } from '../helpCenter-action-types';

const initialState = false;

const loading = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case SEARCH_REQUEST:
    case CONTEXTUAL_SEARCH_REQUEST:
      return true;
    case SEARCH_SUCCESS:
    case CONTEXTUAL_SEARCH_SUCCESS:
    case CONTEXTUAL_SEARCH_SUCCESS_NO_RESULTS:
    case SEARCH_FAILURE:
      return false;
    default:
      return state;
  }
};

export default loading;

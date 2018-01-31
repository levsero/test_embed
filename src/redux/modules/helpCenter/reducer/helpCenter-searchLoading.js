import {
  CONTEXTUAL_SEARCH_REQUEST_SENT,
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS_NO_RESULTS,
  SEARCH_REQUEST_SENT,
  SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_FAILURE
 } from '../helpCenter-action-types';

const initialState = false;

const loading = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case SEARCH_REQUEST_SENT:
    case CONTEXTUAL_SEARCH_REQUEST_SENT:
      return true;
    case SEARCH_REQUEST_SUCCESS:
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS_NO_RESULTS:
    case SEARCH_REQUEST_FAILURE:
      return false;
    default:
      return state;
  }
};

export default loading;

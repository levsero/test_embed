import {
  SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_FAILURE } from '../helpCenter-action-types';

const initialState = 0;

const totalUserSearches = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case SEARCH_REQUEST_SUCCESS:
    case SEARCH_REQUEST_FAILURE:
      return state + 1;
    default:
      return state;
  }
};

export default totalUserSearches;

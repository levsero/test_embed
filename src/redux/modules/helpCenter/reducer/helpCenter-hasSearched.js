import {
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  CONTEXTUAL_SEARCH_SUCCESS } from '../helpCenter-action-types';

const initialState = false;

const hasSearched = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CONTEXTUAL_SEARCH_SUCCESS:
    case SEARCH_SUCCESS:
    case SEARCH_FAILURE:
      return true;
    default:
      return state;
  }
};

export default hasSearched;

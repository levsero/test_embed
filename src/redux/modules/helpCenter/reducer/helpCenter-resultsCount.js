import { CONTEXTUAL_SEARCH_REQUEST_SUCCESS, SEARCH_REQUEST_SUCCESS } from '../helpCenter-action-types';

const initialState = 0;

const resultsCount = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
    case SEARCH_REQUEST_SUCCESS:
      return payload.resultsCount;
    default:
      return state;
  }
};

export default resultsCount;

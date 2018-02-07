import { CONTEXTUAL_SEARCH_REQUEST_SUCCESS, SEARCH_REQUEST_SUCCESS } from '../helpCenter-action-types';

const initialState = [];

const articles = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
    case SEARCH_REQUEST_SUCCESS:
      return payload.articles;
    default:
      return state;
  }
};

export default articles;

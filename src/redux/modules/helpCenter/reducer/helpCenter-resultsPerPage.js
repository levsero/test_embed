import { CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
         SEARCH_REQUEST_SUCCESS } from '../helpCenter-action-types';

const minimumSearchResults = 3;
const initialState = minimumSearchResults;

const resultsPerPage = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
    case SEARCH_REQUEST_SUCCESS:
      return minimumSearchResults;
    default:
      return state;
  }
};

export default resultsPerPage;

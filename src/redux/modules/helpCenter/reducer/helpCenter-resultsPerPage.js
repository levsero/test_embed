import { CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
         SEARCH_REQUEST_SUCCESS,
         UPDATE_VIEW_MORE_CLICKED } from '../helpCenter-action-types';

const minimumSearchResults = 3;
const maximumSearchResults = 9;
const initialState = minimumSearchResults;

const resultsPerPage = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
    case SEARCH_REQUEST_SUCCESS:
      return minimumSearchResults;
    case UPDATE_VIEW_MORE_CLICKED:
      return maximumSearchResults;
    default:
      return state;
  }
};

export default resultsPerPage;

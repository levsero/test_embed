import { BOT_CONTEXTUAL_SEARCH_RESULTS } from '../action-types';

const initialState = false;

const contextualSearchShown = (state = initialState, action) => {
  switch (action.type) {
    case BOT_CONTEXTUAL_SEARCH_RESULTS:
      return true;
    default:
      return state;
  }
};

export default contextualSearchShown;

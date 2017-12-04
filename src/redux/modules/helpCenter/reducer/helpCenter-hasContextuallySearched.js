import { CONTEXTUAL_SEARCH_SUCCESS } from '../helpCenter-action-types';

const initialState = false;

const hasContextuallySearched = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CONTEXTUAL_SEARCH_SUCCESS:
      return true;
    default:
      return state;
  }
};

export default hasContextuallySearched;

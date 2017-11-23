import {
  SEARCH_REQUEST,
  SEARCH_FAILURE
} from '../helpCenter-action-types';

const initialState = false;

const searchFailed = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case SEARCH_REQUEST:
      return false;
    case SEARCH_FAILURE:
      return true;
    default:
      return state;
  }
};

export default searchFailed;

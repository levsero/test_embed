import {
  SEARCH_REQUEST_SENT,
  SEARCH_REQUEST_FAILURE
} from '../helpCenter-action-types';

const initialState = false;

const searchFailed = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case SEARCH_REQUEST_SENT:
      return false;
    case SEARCH_REQUEST_FAILURE:
      return true;
    default:
      return state;
  }
};

export default searchFailed;

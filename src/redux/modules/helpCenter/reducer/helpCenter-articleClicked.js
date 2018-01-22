import {
  SEARCH_REQUEST,
  UPDATE_ACTIVE_ARTICLE,
  RESET_ACTIVE_ARTICLE
} from '../helpCenter-action-types';

const initialState = false;

const articleClicked = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case RESET_ACTIVE_ARTICLE:
    case SEARCH_REQUEST:
      return false;
    case UPDATE_ACTIVE_ARTICLE:
      return true;
    default:
      return state;
  }
};

export default articleClicked;

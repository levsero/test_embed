import {
  CONTEXTUAL_SEARCH_REQUEST_SENT,
  SEARCH_REQUEST_SENT,
  UPDATE_VIEW_MORE_CLICKED
} from '../helpCenter-action-types';

const initialState = false;

const viewMoreClicked = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CONTEXTUAL_SEARCH_REQUEST_SENT:
    case SEARCH_REQUEST_SENT:
      return false;
    case UPDATE_VIEW_MORE_CLICKED:
      return true;
    default:
      return state;
  }
};

export default viewMoreClicked;

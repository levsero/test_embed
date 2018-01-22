import {
  UPDATE_RESULTS,
  UPDATE_VIEW_MORE_CLICKED
} from '../helpCenter-action-types';

const initialState = false;

const viewMoreClicked = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case UPDATE_RESULTS:
      return false;
    case UPDATE_VIEW_MORE_CLICKED:
      return true;
    default:
      return state;
  }
};

export default viewMoreClicked;

import {
  UPDATE_RESULTS,
  UPDATE_VIEW_MORE_CLICKED
} from '../helpCenter-action-types';

const initialState = false;

const viewMoreClicked = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_RESULTS:
      return !!payload.viewMoreClicked;
    case UPDATE_VIEW_MORE_CLICKED:
      return true;
    default:
      return state;
  }
};

export default viewMoreClicked;

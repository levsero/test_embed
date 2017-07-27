import { UPDATE_BACK_BUTTON_VISIBILITY } from '../base-action-types';

const initialState = false;

const backButtonVisible = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_BACK_BUTTON_VISIBILITY:
      return payload;
    default:
      return state;
  }
};

export default backButtonVisible;

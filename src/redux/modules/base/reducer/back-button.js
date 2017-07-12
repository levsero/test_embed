import { UPDATE_BACK_BUTTON_VISIBILITY } from '../base-action-types';

const initialState = {
  visible: false
};

const backButton = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_BACK_BUTTON_VISIBILITY:
      return {
        ...state,
        visible: payload
      };
    default:
      return state;
  }
};

export default backButton;

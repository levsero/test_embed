import { LAUNCHER_CLICKED, CLOSE_BUTTON_CLICKED } from '../base-action-types';

const initialState = false;

const webWidgetVisible = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CLOSE_BUTTON_CLICKED:
      return false;
    case LAUNCHER_CLICKED:
      return true;
    default:
      return state;
  }
};

export default webWidgetVisible;

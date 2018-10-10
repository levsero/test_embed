import { LAUNCHER_CLICKED, CLOSE_BUTTON_CLICKED } from '../base-action-types';

const initialState = true;

const launcherVisible = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CLOSE_BUTTON_CLICKED:
      return true;
    case LAUNCHER_CLICKED:
      return false;
    default:
      return state;
  }
};

export default launcherVisible;

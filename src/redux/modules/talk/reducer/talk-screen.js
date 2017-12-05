import { UPDATE_SCREEN } from '../talk-action-types';
import { CALLBACK_ONLY_SCREEN } from '../talk-screen-types';

const initialState = CALLBACK_ONLY_SCREEN;

const screen = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SCREEN:
      return action.payload;
    default:
      return state;
  }
};

export default screen;

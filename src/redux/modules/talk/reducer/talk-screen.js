import { UPDATE_SCREEN } from '../talk-action-types';
import { CALL_ME_SCREEN } from '../talk-screen-types';

const initialState = CALL_ME_SCREEN;

const screen = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SCREEN:
      return action.payload;
    default:
      return state;
  }
};

export default screen;

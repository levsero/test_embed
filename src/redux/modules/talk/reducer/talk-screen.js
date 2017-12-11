import { TALK_CALLBACK_SUCCESS, UPDATE_TALK_SCREEN } from '../talk-action-types';
import { CALLBACK_ONLY_SCREEN, SUCCESS_NOTIFICATION_SCREEN } from '../talk-screen-types';

const initialState = CALLBACK_ONLY_SCREEN;

const screen = (state = initialState, action) => {
  switch (action.type) {
    case TALK_CALLBACK_SUCCESS:
      return SUCCESS_NOTIFICATION_SCREEN;
    case UPDATE_TALK_SCREEN:
      return action.payload;
    default:
      return state;
  }
};

export default screen;

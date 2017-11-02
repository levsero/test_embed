import { UPDATE_USER_SETTINGS } from '../../chat-action-types';

const initialState = true;

const sound = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER_SETTINGS:
      return action.payload.sound;
    default:
      return state;
  }
};

export default sound;

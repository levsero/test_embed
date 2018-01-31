import { SOUND_ICON_CLICKED } from '../../chat-action-types';

const initialState = true;

const sound = (state = initialState, action) => {
  switch (action.type) {
    case SOUND_ICON_CLICKED:
      return action.payload.sound;
    default:
      return state;
  }
};

export default sound;

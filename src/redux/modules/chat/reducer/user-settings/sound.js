import _ from 'lodash';
import { SOUND_ICON_CLICKED, GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../chat-action-types';

const initialState = true;

const sound = (state = initialState, action) => {
  switch (action.type) {
    case SOUND_ICON_CLICKED:
      return action.payload.sound;
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return !_.get(action.payload, 'sound.disabled', state);
    default:
      return state;
  }
};

export default sound;

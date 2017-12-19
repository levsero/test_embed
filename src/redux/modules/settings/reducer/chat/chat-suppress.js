import { settings } from 'service/settings';
import {
  UPDATE_SETTINGS_CHAT_SUPPRESS,
  RESET_SETTINGS_CHAT_SUPPRESS
} from '../../settings-action-types';

const initialState = settings.get('chat.suppress') || false;

const suppress = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS_CHAT_SUPPRESS:
      return payload;
    case RESET_SETTINGS_CHAT_SUPPRESS:
      return initialState;
    default:
      return state;
  }
};

export default suppress;

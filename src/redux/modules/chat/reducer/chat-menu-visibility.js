import {
  UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY,
  UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY,
  UPDATE_CHAT_MENU_VISIBILITY
} from '../chat-action-types';

const initialState = false;

const menuVisible = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_CHAT_MENU_VISIBILITY:
      return payload;
    case UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY:
      if (payload === true) {
        return false;
      }
      return state;
    case UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY:
      if (payload === true) {
        return false;
      }
      return state;
    default:
      return state;
  }
};

export default menuVisible;

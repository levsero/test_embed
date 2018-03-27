import { UPDATE_CHAT_MENU_VISIBILITY } from '../chat-action-types';

const initialState = false;

const menuVisible = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_CHAT_MENU_VISIBILITY:
      return payload;
    default:
      return state;
  }
};

export default menuVisible;

import {
  CHAT_BADGE_MINIMIZED
} from '../base-action-types';

import {
  CHAT_MSG_REQUEST_SUCCESS
} from 'src/redux/modules/chat/chat-action-types';
const initialState = false;

const isChatBadgeMinimized = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CHAT_BADGE_MINIMIZED:
    case CHAT_MSG_REQUEST_SUCCESS:
      return true;
    default:
      return state;
  }
};

export default isChatBadgeMinimized;

import { ZOPIM_CHAT_ON_UNREAD_MESSAGES_UPDATE } from '../zopimChat-action-types';

const initialState = 0;

const unreadMessages = (state = initialState, action) => {
  switch (action.type) {
    case ZOPIM_CHAT_ON_UNREAD_MESSAGES_UPDATE:
      return action.payload;
    default:
      return state;
  }
};

export default unreadMessages;

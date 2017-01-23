/* eslint-disable camelcase */
import SortedMap from 'collections/sorted-map';

import {
  SENT_CHAT_MSG_SUCCESS,
  SDK_CHAT_MSG,
  SDK_CHAT_FILE,
  SDK_CHAT_WAIT_QUEUE,
  SDK_CHAT_MEMBER_JOIN,
  SDK_CHAT_MEMBER_LEAVE,
  SDK_CHAT_REQUEST_RATING,
  SDK_CHAT_RATING,
  SDK_CHAT_COMMENT
} from '../chat-action-types';

const initialState = new SortedMap();

const concatChat = (chats, chat) => chats.concat({
  [chat.timestamp]: { ...chat }
});
const formatMessage = (payload, visitor) => {
  return {
    type: 'chat.msg',
    msg: payload.msg,
    timestamp: payload.timestamp,
    ...visitor
  };
};

const chats  = (state = initialState, action) => {
  switch (action.type) {
    case SENT_CHAT_MSG_SUCCESS:
      // need to find a way to get this visitor data from the store
      const visitor = { nick: 'visitor:xxxx', display_name: 'Mr X' };
      const chatMessage = formatMessage(action.payload, visitor);

      return concatChat(state, chatMessage);
    case SDK_CHAT_FILE:
    case SDK_CHAT_WAIT_QUEUE:
    case SDK_CHAT_REQUEST_RATING:
    case SDK_CHAT_RATING:
    case SDK_CHAT_COMMENT:
    case SDK_CHAT_MSG:
    case SDK_CHAT_MEMBER_JOIN:
    case SDK_CHAT_MEMBER_LEAVE:
      return concatChat(state, action.payload.detail);
    default:
      return state;
  }
};

export default chats;

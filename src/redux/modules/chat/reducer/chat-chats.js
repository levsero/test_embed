import Map from 'core-js/library/es6/map';

import {
  SDK_CHAT_MSG,
  SDK_CHAT_FILE,
  SDK_CHAT_QUEUE_POSITION,
  SDK_CHAT_MEMBER_JOIN,
  SDK_CHAT_MEMBER_LEAVE,
  SDK_CHAT_REQUEST_RATING,
  SDK_CHAT_RATING,
  SDK_CHAT_COMMENT,
  CHAT_MSG_REQUEST_SENT,
  CHAT_MSG_REQUEST_SUCCESS,
  CHAT_MSG_REQUEST_FAILURE,
  CHAT_FILE_REQUEST_SENT,
  CHAT_FILE_REQUEST_SUCCESS,
  CHAT_FILE_REQUEST_FAILURE
} from '../chat-action-types';
import { CHAT_MESSAGE_TYPES } from 'constants/chat';

import _ from 'lodash';

const initialState = new Map();

const isAgent = (nick) => nick.indexOf('agent:') > -1;

const concatChat = (chats, chat) => {
  const copy = new Map(chats);

  return copy.set(chat.timestamp, { ...chat });
};

const updateChat = (chats, chat) => {
  const copy = new Map(chats),
    prevChat = chats.get(chat.timestamp);

  const numFailedTries = ((_.get(chat, 'status') === CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE) || 0)
    + _.get(prevChat, 'numFailedTries', 0);

  return copy.set(chat.timestamp, { ...prevChat, ...chat, numFailedTries });
};

const chats = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_MSG_REQUEST_SUCCESS:
    case CHAT_MSG_REQUEST_FAILURE:
    case CHAT_MSG_REQUEST_SENT:
      return updateChat(state, action.payload);

    case CHAT_FILE_REQUEST_SENT:
    case CHAT_FILE_REQUEST_SUCCESS:
    case CHAT_FILE_REQUEST_FAILURE:
      return concatChat(state, action.payload);

    case SDK_CHAT_QUEUE_POSITION:
    case SDK_CHAT_REQUEST_RATING:
    case SDK_CHAT_RATING:
    case SDK_CHAT_COMMENT:
    case SDK_CHAT_MSG:
    case SDK_CHAT_MEMBER_JOIN:
    case SDK_CHAT_MEMBER_LEAVE:
      return concatChat(state, action.payload.detail);

    case SDK_CHAT_FILE:
      // the payload from this event is only used for incoming files as outgoing files are handled by our custom actions
      return isAgent(action.payload.detail.nick) ?
        concatChat(state, action.payload.detail) : state;

    default:
      return state;
  }
};

export default chats;

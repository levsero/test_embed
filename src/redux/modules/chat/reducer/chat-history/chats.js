import Map from 'core-js/library/es6/map';

import {
  SDK_HISTORY_CHAT_MSG,
  SDK_HISTORY_CHAT_FILE,
  SDK_HISTORY_CHAT_QUEUE_POSITION,
  SDK_HISTORY_CHAT_MEMBER_JOIN,
  SDK_HISTORY_CHAT_MEMBER_LEAVE,
  SDK_HISTORY_CHAT_REQUEST_RATING,
  SDK_HISTORY_CHAT_RATING,
  SDK_HISTORY_CHAT_COMMENT
} from '../../chat-action-types';

const initialState = new Map();

const concatChat = (chats, chat) => {
  const copy = new Map(chats);

  return copy.set(chat.timestamp, { ...chat });
};

const concatSDKFile = (chats, chat) => {
  if (!chat.timestamp) return chats;

  const copy = new Map(chats);
  const existingItem = copy.get(chat.timestamp) || {};
  const existingFile = existingItem.file || {
    lastModified: null,
    lastModifiedDate: null,
    webkitRelativePath: ''
  };

  const file = {
    ...existingFile,
    ...chat.attachment,
    type: chat.attachment.mime_type,
    uploading: false
  };

  return copy.set(chat.timestamp, { ...chat, file });
};

const chats = (state = initialState, action) => {
  switch (action.type) {
    case SDK_HISTORY_CHAT_QUEUE_POSITION:
    case SDK_HISTORY_CHAT_REQUEST_RATING:
    case SDK_HISTORY_CHAT_RATING:
    case SDK_HISTORY_CHAT_COMMENT:
    case SDK_HISTORY_CHAT_MSG:
    case SDK_HISTORY_CHAT_MEMBER_JOIN:
    case SDK_HISTORY_CHAT_MEMBER_LEAVE:
      return concatChat(state, action.payload.detail);

    case SDK_HISTORY_CHAT_FILE:
      return concatSDKFile(state, action.payload.detail);

    default:
      return state;
  }
};

export default chats;

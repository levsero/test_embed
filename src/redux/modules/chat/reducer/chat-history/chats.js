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

const concatSDKFile = (chats, chat) => {
  if (!chat.timestamp) return chats;

  const existingItem = chats.get(chat.timestamp) || {};
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

  return new Map([
    ...new Map().set(chat.timestamp, { ...chat, file }),
    ...chats
  ]);
};

const chats = (state = initialState, action) => {
  const detail = action.payload && action.payload.detail;

  switch (action.type) {
    case SDK_HISTORY_CHAT_QUEUE_POSITION:
    case SDK_HISTORY_CHAT_REQUEST_RATING:
    case SDK_HISTORY_CHAT_RATING:
    case SDK_HISTORY_CHAT_COMMENT:
    case SDK_HISTORY_CHAT_MSG:
    case SDK_HISTORY_CHAT_MEMBER_JOIN:
    case SDK_HISTORY_CHAT_MEMBER_LEAVE:
      const newEntry = new Map();

      newEntry.set(
        detail.timestamp,
        (detail.nick === '__trigger') ? { ...detail, nick: 'agent:trigger' } : detail
      );

      return new Map([...newEntry, ...state]);

    case SDK_HISTORY_CHAT_FILE:
      return concatSDKFile(state, detail);

    default:
      return state;
  }
};

export default chats;

import Map from 'core-js/library/es6/map';

import {
  SDK_HISTORY_CHAT_FILE,
  HISTORY_REQUEST_SUCCESS
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
  const { type, payload } = action;
  const detail = payload && payload.detail;

  switch (type) {
    case HISTORY_REQUEST_SUCCESS:
      return new Map([...payload.history, ...state]);

    case SDK_HISTORY_CHAT_FILE:
      return concatSDKFile(state, detail);

    default:
      return state;
  }
};

export default chats;

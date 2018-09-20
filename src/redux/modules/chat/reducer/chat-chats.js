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
  CHAT_FILE_REQUEST_FAILURE,
  SET_VISITOR_INFO_REQUEST_SUCCESS
} from '../chat-action-types';
import {CHAT_MESSAGE_TYPES, CHAT_CUSTOM_MESSAGE_EVENTS, CHAT_SYSTEM_EVENTS } from 'constants/chat';

import _ from 'lodash';

const initialState = new Map();

const concatContactDetailsUpdated = (chats, payload) => {
  const copy = new Map(chats);
  const contactDetailsUpdated = {
    timestamp: payload.timestamp,
    type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_CONTACT_DETAILS_UPDATED
  };

  return copy.set(payload.timestamp, contactDetailsUpdated);
};

const concatChat = (chats, chat) => {
  const copy = new Map(chats);
  const timestamp = chat.timestamp || Date.now();

  return copy.set(timestamp, { ...chat, timestamp });
};

const concatQuickReply = (chats, chat) => {
  const copy = new Map(chats);
  const timestamp = chat.timestamp || Date.now();
  const newMsg = chat.structured_msg.msg;
  const chatMessage = {
    ...chat,
    timestamp,
    msg: newMsg,
    options: [] // We do not want options for a quick reply message
  };
  const quickReplies = {
    type: CHAT_CUSTOM_MESSAGE_EVENTS.CHAT_QUICK_REPLIES,
    nick: chat.nick,
    items: _.values(chat.structured_msg.quick_replies),
    timestamp: timestamp + 1
  };

  copy.set(timestamp, chatMessage);
  copy.set(timestamp + 1, quickReplies);

  return copy;
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
    case SDK_CHAT_MEMBER_JOIN:
    case SDK_CHAT_MEMBER_LEAVE:
      return concatChat(state, action.payload.detail);

    case SDK_CHAT_MSG:
      const { detail } = action.payload;

      if (detail.structured_msg && detail.structured_msg.type === 'QuickReplies') {
        return concatQuickReply(state, detail);
      }

      return concatChat(state, detail);

    case SDK_CHAT_FILE:
      return concatSDKFile(state, action.payload.detail);

    case SET_VISITOR_INFO_REQUEST_SUCCESS:
      return concatContactDetailsUpdated(state, action.payload);
    default:
      return state;
  }
};

export default chats;

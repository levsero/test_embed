import {
  SDK_CHAT_MSG,
  SDK_CHAT_FILE,
  SDK_CHAT_QUEUE_POSITION,
  SDK_CHAT_MEMBER_JOIN,
  SDK_CHAT_MEMBER_LEAVE,
  SDK_CHAT_REQUEST_RATING,
  SDK_CHAT_RATING,
  SDK_CHAT_COMMENT,
  SET_VISITOR_INFO_REQUEST_SUCCESS,
  CHAT_MSG_REQUEST_SENT,
  CHAT_FILE_REQUEST_SENT
} from '../chat-action-types';
import { CHAT_STRUCTURED_CONTENT_TYPE } from 'constants/chat';

const initialState = {
  firstVisitorMessage: null,
  latestRating: null,
  latestRatingRequest: null,
  latestQuickReply: null,
  groups: []
};

const newMessageGroup = (author, timestamp) => ({
  type: 'message',
  author,
  messages: [timestamp]
});

const newEventGroup = (event) => ({
  type: 'event',
  author: event.nick || 'system',
  messages: [event.timestamp]
});

const getLastGroup = (groups) => {
  const index = groups.length > 0 ? groups.length - 1 : null;
  const group = groups.length > 0 ? groups[index] : {};

  return [group, index];
};

const updateChatLog = (groups, chat) => {
  const [group, lastIndex] = getLastGroup(groups);

  if (group.type === 'message' && group.author === chat.nick) {
    return groups.map((item, index) => {
      if (index !== lastIndex) return item;

      return {
        ...item,
        messages: [...item.messages, chat.timestamp]
      };
    });
  }

  return [...groups, newMessageGroup(chat.nick, chat.timestamp)];
};

const chatLog = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_MSG_REQUEST_SENT:
    case CHAT_FILE_REQUEST_SENT:
    case SDK_CHAT_FILE:
    case SDK_CHAT_MSG:
      let messageExtras = {};

      if (state.firstVisitorMessage === null) {
        messageExtras.firstVisitorMessage = action.payload.detail.timestamp;
      }
      if (
        action.payload.detail.structured_msg &&
        action.payload.detail.structured_msg.type === CHAT_STRUCTURED_CONTENT_TYPE.QUICK_REPLIES
      ) {
        messageExtras.latestQuickReply = action.payload.detail.timestamp + 1;
      }

      return {
        ...state,
        ...messageExtras,
        groups: updateChatLog(state.groups, action.payload.detail)
      };
    case SDK_CHAT_REQUEST_RATING:
      return {
        ...state,
        latestRatingRequest: action.payload.detail.timestamp,
        groups: [...state.groups, newEventGroup(action.payload.detail)]
      };
    case SDK_CHAT_RATING:
      return {
        ...state,
        latestRating: action.payload.detail.timestamp,
        groups: [...state.groups, newEventGroup(action.payload.detail)]
      };
    case SDK_CHAT_QUEUE_POSITION:
    case SDK_CHAT_COMMENT:
    case SDK_CHAT_MEMBER_JOIN:
    case SDK_CHAT_MEMBER_LEAVE:
      return {
        ...state,
        groups: [...state.groups, newEventGroup(action.payload.detail)]
      };
    case SET_VISITOR_INFO_REQUEST_SUCCESS:
      return {
        ...state,
        groups: [...state.groups, newEventGroup(action.payload)]
      };
    default:
      return state;
  }
};

export default chatLog;

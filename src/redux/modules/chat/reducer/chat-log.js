import { combineReducers } from 'redux';
import {
  SDK_CHAT_MSG,
  SDK_CHAT_FILE,
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

const firstVisitorMessage = (state = -1, action) => {
  switch (action.type) {
    case CHAT_MSG_REQUEST_SENT:
    case CHAT_FILE_REQUEST_SENT:
    case SDK_CHAT_FILE:
    case SDK_CHAT_MSG:
      if (state === -1) {
        return action.payload.detail.timestamp;
      }
      return state;
    default:
      return state;
  }
};

const latestRating = (state = -1, action) => {
  switch (action.type) {
    case SDK_CHAT_RATING:
      return action.payload.detail.timestamp;
    default:
      return state;
  }
};

const latestRatingRequest = (state = -1, action) => {
  switch (action.type) {
    case SDK_CHAT_REQUEST_RATING:
      return action.payload.detail.timestamp;
    default:
      return state;
  }
};

const latestQuickReply = (state = -1, action) => {
  switch (action.type) {
    case CHAT_MSG_REQUEST_SENT:
    case CHAT_FILE_REQUEST_SENT:
    case SDK_CHAT_FILE:
    case SDK_CHAT_MSG:
      if (
        action.payload.detail.structured_msg &&
        action.payload.detail.structured_msg.type === CHAT_STRUCTURED_CONTENT_TYPE.QUICK_REPLIES
      ) {
        return action.payload.detail.timestamp + 1;
      }

      return -1;
    case SDK_CHAT_REQUEST_RATING:
    case SDK_CHAT_RATING:
    case SDK_CHAT_COMMENT:
    case SDK_CHAT_MEMBER_JOIN:
    case SDK_CHAT_MEMBER_LEAVE:
    case SET_VISITOR_INFO_REQUEST_SUCCESS:
      return -1;
    default:
      return state;
  }
};

const latestAgentLeaveEvent = (state = -1, action) => {
  switch (action.type) {
    case SDK_CHAT_MEMBER_LEAVE:
      return action.payload.detail.nick.indexOf('agent') > -1
        ? action.payload.detail.timestamp
        : state;
    default:
      return state;
  }
};

const lastMessageAuthor = (state = '', action) => {
  switch (action.type) {
    case CHAT_MSG_REQUEST_SENT:
    case CHAT_FILE_REQUEST_SENT:
    case SDK_CHAT_FILE:
    case SDK_CHAT_MSG:
      return action.payload.detail.nick;
    default:
      return state;
  }
};

const newMessageGroup = (message) => ({
  type: 'message',
  author: message.nick,
  messages: [message.timestamp]
});

const newEventGroup = (event) => ({
  type: 'event',
  author: event.nick || 'system',
  messages: [event.timestamp]
});

const groups = (state = [], action) => {
  switch (action.type) {
    case CHAT_MSG_REQUEST_SENT:
    case CHAT_FILE_REQUEST_SENT:
    case SDK_CHAT_FILE:
    case SDK_CHAT_MSG:
      const message = action.payload.detail;
      const groupsCopy = [...state];
      const lastGroup = groupsCopy.pop();

      if (lastGroup && lastGroup.type === 'message' && lastGroup.author === message.nick) {
        lastGroup.messages.push(message.timestamp);
        return [...groupsCopy, lastGroup];
      }

      return [...state, newMessageGroup(message)];
    case SDK_CHAT_REQUEST_RATING:
    case SDK_CHAT_RATING:
    case SDK_CHAT_COMMENT:
    case SDK_CHAT_MEMBER_JOIN:
    case SDK_CHAT_MEMBER_LEAVE:
      return [...state, newEventGroup(action.payload.detail)];
    case SET_VISITOR_INFO_REQUEST_SUCCESS:
      return [...state, newEventGroup(action.payload)];
    default:
      return state;
  }
};

const chatLogReducer = combineReducers({
  firstVisitorMessage,
  latestRating,
  latestRatingRequest,
  latestQuickReply,
  latestAgentLeaveEvent,
  lastMessageAuthor,
  groups
});

export default chatLogReducer;

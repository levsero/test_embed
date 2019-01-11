import _ from 'lodash';
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

const UNSET_TIMESTAMP = -1;
const initialState = {
  firstVisitorMessage: UNSET_TIMESTAMP,
  latestRating: UNSET_TIMESTAMP,
  latestRatingRequest: UNSET_TIMESTAMP,
  latestQuickReply: UNSET_TIMESTAMP,
  latestAgentLeaveEvent: UNSET_TIMESTAMP,
  lastMessageAuthor: '',
  groups: []
};

const firstVisitorMessage = (state = initialState.firstVisitorMessage, action) => {
  switch (action.type) {
    case CHAT_MSG_REQUEST_SENT:
    case CHAT_FILE_REQUEST_SENT:
      return state === initialState.firstVisitorMessage
        ? action.payload.detail.timestamp
        : state;
    default:
      return state;
  }
};

const latestRating = (state = initialState.latestRating, action) => {
  switch (action.type) {
    case SDK_CHAT_RATING:
      return action.payload.detail.timestamp;
    default:
      return state;
  }
};

const latestRatingRequest = (state = initialState.latestRatingRequest, action) => {
  switch (action.type) {
    case SDK_CHAT_REQUEST_RATING:
      return action.payload.detail.timestamp;
    default:
      return state;
  }
};

const latestQuickReply = (state = initialState.latestQuickReply, action) => {
  switch (action.type) {
    case SDK_CHAT_MSG:
      const { structured_msg: structMsg, timestamp } = action.payload.detail;

      return structMsg && structMsg.type === CHAT_STRUCTURED_CONTENT_TYPE.QUICK_REPLIES
        ? timestamp + 1
        : UNSET_TIMESTAMP;
    case CHAT_MSG_REQUEST_SENT:
    case CHAT_FILE_REQUEST_SENT:
    case SDK_CHAT_FILE:
    case SDK_CHAT_REQUEST_RATING:
    case SDK_CHAT_RATING:
    case SDK_CHAT_COMMENT:
    case SET_VISITOR_INFO_REQUEST_SUCCESS:
      return UNSET_TIMESTAMP;
    default:
      return state;
  }
};

const latestAgentLeaveEvent = (state = initialState.latestAgentLeaveEvent, action) => {
  switch (action.type) {
    case SDK_CHAT_MEMBER_LEAVE:
      return action.payload.detail.nick.indexOf('agent') > -1
        ? action.payload.detail.timestamp
        : state;
    default:
      return state;
  }
};

const lastMessageAuthor = (state = initialState.lastMessageAuthor, action) => {
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

const newGroup = (message, type) => ({
  type,
  author: message.nick || 'system',
  messages: [message.timestamp]
});

const groups = (state = initialState.groups, action) => {
  switch (action.type) {
    case CHAT_MSG_REQUEST_SENT:
    case CHAT_FILE_REQUEST_SENT:
    case SDK_CHAT_FILE:
    case SDK_CHAT_MSG:
      const message = action.payload.detail;
      const groupsCopy = [...state];
      const lastGroup = _.last(groupsCopy);

      if (lastGroup && lastGroup.type === 'message' && lastGroup.author === message.nick) {
        lastGroup.messages.push(message.timestamp);
        return groupsCopy;
      }

      return [...state, newGroup(message, 'message')];
    case SDK_CHAT_REQUEST_RATING:
    case SDK_CHAT_RATING:
    case SDK_CHAT_COMMENT:
    case SDK_CHAT_MEMBER_JOIN:
    case SDK_CHAT_MEMBER_LEAVE:
      return [...state, newGroup(action.payload.detail, 'event')];
    case SET_VISITOR_INFO_REQUEST_SUCCESS:
      return [...state, newGroup(action.payload, 'event')];
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

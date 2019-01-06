import {
  SDK_HISTORY_CHAT_MSG,
  SDK_HISTORY_CHAT_FILE,
  SDK_HISTORY_CHAT_QUEUE_POSITION,
  SDK_HISTORY_CHAT_MEMBER_JOIN,
  SDK_HISTORY_CHAT_MEMBER_LEAVE,
  SDK_HISTORY_CHAT_REQUEST_RATING,
  SDK_HISTORY_CHAT_RATING,
  SDK_HISTORY_CHAT_COMMENT,
  HISTORY_REQUEST_SUCCESS
} from '../../chat-action-types';

const initialState = {
  entries: [],
  buffer: []
};

const newMessageGroup = (message) => ({
  type: 'message',
  author: message.nick,
  first: !!message.first,
  messages: [message.timestamp]
});

const newEventGroup = (event) => ({
  type: 'event',
  author: event.nick || 'system',
  first: !!event.first,
  messages: [event.timestamp]
});

const addMessage = (groups, message) => {
  const groupsCopy = [...groups];
  const lastGroup = groupsCopy.pop();

  if (lastGroup && lastGroup.type === 'message' && lastGroup.author === message.nick) {
    lastGroup.messages.push(message.timestamp);
    return [...groupsCopy, lastGroup];
  }

  return [...groups, newMessageGroup(message)];
};

const log = (state = initialState, action) => {
  switch (action.type) {
    case SDK_HISTORY_CHAT_FILE:
    case SDK_HISTORY_CHAT_MSG:
      return {
        ...state,
        buffer: addMessage(state.buffer, action.payload.detail)
      };
    case SDK_HISTORY_CHAT_QUEUE_POSITION:
    case SDK_HISTORY_CHAT_REQUEST_RATING:
    case SDK_HISTORY_CHAT_RATING:
    case SDK_HISTORY_CHAT_COMMENT:
    case SDK_HISTORY_CHAT_MEMBER_JOIN:
    case SDK_HISTORY_CHAT_MEMBER_LEAVE:
      return {
        ...state,
        buffer: [...state.buffer, newEventGroup(action.payload.detail)]
      };
    case HISTORY_REQUEST_SUCCESS:
      return {
        entries: [...state.buffer, ...state.entries],
        buffer: []
      };
    default:
      return state;
  }
};

export default log;

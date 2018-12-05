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

const newMessageGroup = (author, timestamp, first = false) => ({
  type: 'message',
  author,
  first,
  messages: [timestamp]
});

const newEventGroup = (event) => ({
  type: 'event',
  author: event.nick || 'system',
  first: !!event.first,
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

  return [...groups, newMessageGroup(chat.nick, chat.timestamp, !!chat.first)];
};

const log = (state = initialState, action) => {
  switch (action.type) {
    case SDK_HISTORY_CHAT_FILE:
    case SDK_HISTORY_CHAT_MSG:
      return {
        ...state,
        buffer: updateChatLog(state.buffer, action.payload.detail)
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

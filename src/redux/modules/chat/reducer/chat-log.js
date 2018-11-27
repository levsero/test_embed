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

const initialState = [];
let firstVisitorMessageSet = false;

const newMessageGroup = (author, timestamp) => {
  let newGroup = {
    type: 'message',
    author,
    messages: [timestamp]
  };

  if (!firstVisitorMessageSet && !(author.indexOf('agent:') > -1)) {
    firstVisitorMessageSet = true;
    return { ...newGroup, isFirstVisitorMessage: true };
  }

  return newGroup;
};

const newEventGroup = (event) => ({
  type: 'event',
  author: event.nick || 'system',
  messages: [(event.timestamp || Date.now())]
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
      if (index !== lastIndex) {
        return item;
      }

      return {
        ...item,
        messages: [
          ...item.messages,
          chat.timestamp
        ]
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
      return updateChatLog(state, action.payload.detail);
    case SDK_CHAT_QUEUE_POSITION:
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

export default chatLog;

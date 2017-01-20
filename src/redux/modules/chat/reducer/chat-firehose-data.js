import { FIREHOSE_DATA } from '../chat-action-types';

const initialState = {
  connection: '',
  account_status: '',
  departments: [],
  visitor: {},
  agents: {},
  chats: new SortedMap(),
  is_chatting: false
};

function processFirehoseData(state, _action) {
  const isAgent = (nick) => nick.startsWith('agent:');
  const concatChat = (chats, chat) => chats.concat({
    [chat.timestamp]: { ...chat }
  });
  const action = _action.payload;

  switch (action.type) {
    case 'connection_update':
      return {
        ...state,
        connection: action.detail
      };
    case 'account_status':
      return {
        ...state,
        account_status: action.detail
      };
    case 'department_update':
      return {
        ...state,
        departments: action.detail
      };
    case 'visitor_update':
      return {
        ...state,
        visitor: {
          ...state.visitor,
          ...action.detail
        }
      };
    case 'agent_update':
      const isTyping = (state.agents[action.detail.nick] || { typing: false }).typing;

      return {
        ...state,
        agents: {
          ...state.agents,
          [action.detail.nick]: {
            ...action.detail,
            nick: action.detail.nick,
            typing: isTyping
          }
        }
      };
    case 'chat':
      let newState = { ...state };

      switch (action.detail.type) {
        case 'chat.memberjoin':
          if (isAgent(action.detail.nick)) {
            if (!newState.agents[action.detail.nick]) {
              newState.agents[action.detail.nick] = {};
            }
            newState.agents[action.detail.nick].nick = action.detail.nick;
          }
          else {
            newState.visitor.nick = action.detail.nick;
            newState.is_chatting = true;
          }

          return {
            ...newState,
            chats: concatChat(state.chats, action.detail)
          };
        case 'chat.memberleave':
          if (!isAgent(action.detail.nick)) {
            newState.is_chatting = false;
          }

          return {
            ...newState,
            chats: concatChat(state.chats, action.detail)
          };
        case 'chat.file':
        case 'chat.wait_queue':
        case 'chat.request.rating':
        case 'chat.msg':
          return {
            ...newState,
            chats: concatChat(state.chats, action.detail)
          };
        case 'typing':
          return {
            ...state,
            agents: {
              ...state.agents,
              [action.detail.nick]: {
                ...state.agents[action.detail.nick],
                typing: action.detail.typing
              }
            }
          };
        default:
          return state;
      }
      break;
    default:
      return state;
  }
}

const firehoseData = (state = initialState, action) => {
  switch (action.type) {
    case FIREHOSE_DATA:
      return _.extend({}, state, processFirehoseData(state, action));
    default:
      return state;
  }
}

export default firehoseData;

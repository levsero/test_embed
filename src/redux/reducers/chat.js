/* eslint-disable camelcase */
import _ from 'lodash';
import SortedMap from 'collections/sorted-map';

import zChat from 'vendor/web-sdk';

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
  const action = _action.payload;

  const isAgent = (nick) => nick.startsWith('agent:');

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
          }

          if (!isAgent(action.detail.nick)) {
            newState.is_chatting = true;
          }

          newState.chats = state.chats.concat({
            [action.detail.timestamp]: { ...action.detail }
          });

          return newState;
        case 'chat.memberleave':
          if (!isAgent(action.detail.nick)) {
            newState.is_chatting = false;
          }

          newState.chats = state.chats.concat({
            [action.detail.timestamp]: { ...action.detail }
          });

          return newState;
        case 'chat.file':
        case 'chat.wait_queue':
        case 'chat.request.rating':
        case 'chat.msg':
          newState.chats = state.chats.concat({
            [action.detail.timestamp]: { ...action.detail }
          });

          return newState;
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

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case 'SENT_CHAT_MSG':
      return {
        ...state,
        chats: state.chats.concat({
          [payload.detail.timestamp]: payload.detail
        })
      };
    case 'UPDATE_CHAT_MSG':
      zChat.sendTyping(true);
      setTimeout(() => zChat.sendTyping(false), 2000);

      return {
        ...state,
        currentMessage: payload
      };
    case 'FIREHOSE_DATA':
      return _.extend({}, state, processFirehoseData(state, action));
    default:
      return state;
  }
}

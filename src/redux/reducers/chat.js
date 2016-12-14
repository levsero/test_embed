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

const copyMerge = (dest, src = {}) => _.extend({}, dest, src);

function processFirehoseData(state, _action) {
  const action = _action.payload;

  const isAgent = (nick) => nick.startsWith('agent:');

  switch (action.type) {
    case 'connection_update':
      return copyMerge(state, { connection: action.detail });
    case 'account_status':
      return copyMerge(state, { account_status: action.detail });
    case 'department_update':
      return copyMerge(state, { departments: action.detail });

    case 'visitor_update':
      return copyMerge(state, { visitor: copyMerge(state.visitor, action.detail)});

    case 'agent_update':
      return copyMerge(state, {

        agents: copyMerge(state.agents, {

          [action.detail.nick]: copyMerge(action.detail, {
            nick: action.detail.nick, // To be removed after standardization
            typing: (state.agents[action.detail.nick] || {typing: false}).typing
          })
        })
      });

    case 'chat':
      const new_state = copyMerge(state);

      switch (action.detail.type) {
        /* Web SDK events */
        case 'chat.memberjoin':
          if (isAgent(action.detail.nick)) {
            if (!new_state.agents[action.detail.nick]) new_state.agents[action.detail.nick] = {};
            new_state.agents[action.detail.nick].nick = action.detail.nick;
          }
          else
            new_state.visitor.nick = action.detail.nick;

          if (!isAgent(action.detail.nick)) {
            new_state.is_chatting = true;
          }

          // Concat this event to chats to be displayed
          new_state.chats = copyMerge(state.chats, {
            [action.detail.timestamp]: copyMerge(action.detail)
          });

          return new_state;

        case 'chat.memberleave':
          if (!isAgent(action.detail.nick)) {
            new_state.is_chatting = false;
          }

          // Concat this event to chats to be displayed
          new_state.chats = copyMerge(state.chats, {
            [action.detail.timestamp]: copyMerge(action.detail)
          });
          return new_state;

        case 'chat.file':
        case 'chat.wait_queue':
        case 'chat.request.rating':
        case 'chat.msg':
          new_state.chats = state.chats.concat({
            [action.detail.timestamp]: copyMerge(action.detail)
          });
          return new_state;

        case 'typing':
          return copyMerge(state, {

            agents: copyMerge(state.agents, {

              [action.detail.nick]: copyMerge(state.agents[action.detail.nick], {
                typing: action.detail.typing
              })
            })
          });

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
      return copyMerge(state, {
        chats: state.chats.concat({
          [payload.detail.timestamp]: payload.detail
        })
      });

    case 'UPDATE_CHAT_MSG':
      zChat.sendTyping(true);
      setTimeout(() => zChat.sendTyping(false), 2000);

      return copyMerge(state, { currentMessage: payload });

    case 'FIREHOSE_DATA':
      return copyMerge(state, processFirehoseData(state, action));

    default:
      return state;
  }
}

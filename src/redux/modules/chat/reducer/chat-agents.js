import {
  SDK_CHAT_MEMBER_JOIN,
  SDK_CHAT_TYPING,
  SDK_AGENT_UPDATE
} from '../chat-action-types';

const initialState = {};

const isAgent = (nick) => nick.startsWith('agent:');

const agents = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case SDK_CHAT_MEMBER_JOIN:
      if (isAgent(payload.detail.nick)) {
        return {
          ...state,
          [payload.detail.nick]: {
            ...state[payload.detail.nick],
            nick: payload.detail.nick
          }
        };
      }
      return state;
    case SDK_CHAT_TYPING:
      return {
        ...state,
        [payload.detail.nick]: {
          ...state[payload.detail.nick],
          typing: payload.detail.typing
        }
      };
    case SDK_AGENT_UPDATE:
      const isTyping = (state[payload.detail.nick] || { typing: false }).typing;

      return {
        ...state,
        [payload.detail.nick]: {
          ...payload.detail,
          nick: payload.detail.nick,
          typing: isTyping
        }
      };
    default:
      return state;
  }
}

export default agents;

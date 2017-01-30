import { SDK_CHAT_MEMBER_JOIN, SDK_VISITOR_UPDATE } from '../chat-action-types';

const initialState = {};

const isAgent = (nick) => nick.startsWith('agent:');

const visitor = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case SDK_CHAT_MEMBER_JOIN:
      if (!isAgent(payload.detail.nick)) {
        return {
          ...state,
          nick: payload.detail.nick
        };
      }
      return state;
    case SDK_VISITOR_UPDATE:
      return {
        ...state,
        ...payload.detail
      };
    default:
      return state;
  }
};

export default visitor;

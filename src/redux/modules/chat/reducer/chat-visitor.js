import { SDK_CHAT_MEMBER_JOIN, SDK_VISITOR_UPDATE, SET_VISITOR_INFO_REQUEST_SUCCESS } from '../chat-action-types';

const initialState = {};

const isAgent = (nick) => nick.indexOf('agent:') > -1;

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
        ...payload.detail,
        nick: payload.detail.nick || 'visitor'
      };
    case SET_VISITOR_INFO_REQUEST_SUCCESS:
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
};

export default visitor;

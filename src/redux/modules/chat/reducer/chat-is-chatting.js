import { SDK_CHAT_MEMBER_JOIN, SDK_CHAT_MEMBER_LEAVE } from '../chat-action-types';

const initialState = false;

const isAgent = (nick) => nick.indexOf('agent:') > -1;

const isChatting = (state = initialState, action) => {
  switch (action.type) {
    case SDK_CHAT_MEMBER_JOIN:
      if (!isAgent(action.payload.detail.nick)) {
        return true;
      }
      return state;
    case SDK_CHAT_MEMBER_LEAVE:
      if (!isAgent(action.payload.detail.nick)) {
        return false;
      }
      return state;
    default:
      return state;
  }
};

export default isChatting;

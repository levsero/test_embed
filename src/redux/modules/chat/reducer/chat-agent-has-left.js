import { SDK_CHAT_MEMBER_LEAVE } from '../chat-action-types';

const initialState = false;

const isAgent = (nick) => nick.indexOf('agent:') > -1;

const agentHasLeft = (state = initialState, action) => {
  switch (action.type) {
    case SDK_CHAT_MEMBER_LEAVE:
      if (isAgent(action.payload.detail.nick)) {
        return true;
      }
      return false;
    default:
      return false;
  }
};

export default agentHasLeft;

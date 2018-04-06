import {
  SDK_CHAT_MEMBER_JOIN,
  END_CHAT_REQUEST_SUCCESS } from '../chat-action-types';
import { AGENT_BOT } from 'constants/chat';

const initialState = false;

const isAgent = (nick) => nick.indexOf('agent:') > -1 && nick !== AGENT_BOT;

const agentJoined = (state = initialState, action) => {
  switch (action.type) {
    case SDK_CHAT_MEMBER_JOIN:
      if (isAgent(action.payload.detail.nick)) {
        return true;
      }
      return state;
    case END_CHAT_REQUEST_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

export default agentJoined;

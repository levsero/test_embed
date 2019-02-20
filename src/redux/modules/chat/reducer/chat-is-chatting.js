import {
  IS_CHATTING,
  UPDATE_PREVIEWER_SCREEN,
  SDK_CHAT_MEMBER_JOIN,
  SDK_CHAT_MEMBER_LEAVE,
  END_CHAT_REQUEST_SUCCESS,
  CHAT_BANNED } from '../chat-action-types';

const initialState = false;

const isAgent = (nick) => nick.indexOf('agent:') > -1;

const isChatting = (state = initialState, action) => {
  switch (action.type) {
    case IS_CHATTING:
      return action.payload;
    case UPDATE_PREVIEWER_SCREEN:
      return action.payload.status;
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
    case CHAT_BANNED:
    case END_CHAT_REQUEST_SUCCESS:
      return false;
    default:
      return state;
  }
};

export default isChatting;

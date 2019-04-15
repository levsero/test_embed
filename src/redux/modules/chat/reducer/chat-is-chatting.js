import _ from 'lodash';
import {
  UPDATE_PREVIEWER_SCREEN,
  CHAT_MSG_REQUEST_SUCCESS,
  END_CHAT_REQUEST_SUCCESS,
  CHAT_BANNED,
  IS_CHATTING
} from '../chat-action-types';
import { store } from 'service/persistence';

const initialState = _.get(store.get('store'), 'is_chatting', false);

const isChatting = (state = initialState, action) => {
  switch (action.type) {
    case IS_CHATTING:
      return action.payload;
    case UPDATE_PREVIEWER_SCREEN:
      return action.payload.status;
    case CHAT_MSG_REQUEST_SUCCESS:
      return true;
    case CHAT_BANNED:
    case END_CHAT_REQUEST_SUCCESS:
      return false;
    default:
      return state;
  }
};

export default isChatting;

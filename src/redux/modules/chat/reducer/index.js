import { combineReducers } from 'redux';
import chats from './chat-chats';
import currentMessage from './chat-current-message';

export default combineReducers({
  chats,
  currentMessage
})


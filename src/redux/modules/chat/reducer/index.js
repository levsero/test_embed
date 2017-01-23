/* eslint-disable camelcase */
import { combineReducers } from 'redux';

import accountStatus from './chat-account-status';
import agents from './chat-agents';
import chats from './chat-chats';
import connection from './chat-connection';
import currentMessage from './chat-current-message';
import departments from './chat-departments';
import isChatting from './chat-is-chatting';
import visitor from './chat-visitor';

export default combineReducers({
  account_status: accountStatus,
  agents,
  chats,
  connection,
  currentMessage,
  departments,
  is_chatting: isChatting,
  visitor
});


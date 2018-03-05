import { combineReducers } from 'redux';

import accountSettings from './account-settings/';
import accountStatus from './chat-account-status';
import agents from './chat-agents';
import chats from './chat-chats';
import connection from './chat-connection';
import currentMessage from './chat-current-message';
import departments from './chat-departments';
import isChatting from './chat-is-chatting';
import agentHasLeft from './chat-agent-has-left';
import visitor from './chat-visitor';
import rating from './chat-rating';
import notification from './chat-notification';
import screen from './chat-screen';
import userSettings from './user-settings/';
import emailTranscript from './chat-email-transcript';
import formState from './form-state';

export default combineReducers({
  accountSettings,
  account_status: accountStatus,
  agents,
  chats,
  connection,
  currentMessage,
  departments,
  is_chatting: isChatting,
  agentHasLeft,
  visitor,
  rating,
  notification,
  screen,
  userSettings,
  emailTranscript,
  formState
});

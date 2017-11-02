import { combineReducers } from 'redux';

import accountSettings from './account-settings/';
import accountStatus from './chat-account-status';
import agents from './chat-agents';
import chats from './chat-chats';
import connection from './chat-connection';
import currentMessage from './chat-current-message';
import departments from './chat-departments';
import isChatting from './chat-is-chatting';
import visitor from './chat-visitor';
import rating from './chat-rating';
import notification from './chat-notification';
import screen from './chat-screen';
import showEndNotification from './chat-show-end-notification';
import showContactDetailsNotification from './chat-show-contact-details-notification';
import userSettings from './user-settings/';

export default combineReducers({
  accountSettings,
  account_status: accountStatus,
  agents,
  chats,
  connection,
  currentMessage,
  departments,
  is_chatting: isChatting,
  visitor,
  rating,
  notification,
  screen,
  showEndNotification,
  showContactDetailsNotification,
  userSettings
});

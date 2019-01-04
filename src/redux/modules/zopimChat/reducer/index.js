import { combineReducers } from 'redux';

import status from './zopimChat-status';
import connected from './zopimChat-connected';
import isChatting from './zopimChat-isChatting';
import isOpen from './zopimChat-isOpen';
import unreadMessages from './unread-messages';

export default combineReducers({
  status,
  connected,
  isChatting,
  isOpen,
  unreadMessages
});

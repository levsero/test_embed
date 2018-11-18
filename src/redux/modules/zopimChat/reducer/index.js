import { combineReducers } from 'redux';

import status from './zopimChat-status';
import connected from './zopimChat-connected';
import isChatting from './zopimChat-isChatting';
import isOpen from './zopimChat-isOpen';

export default combineReducers({
  status,
  connected,
  isChatting,
  isOpen
});

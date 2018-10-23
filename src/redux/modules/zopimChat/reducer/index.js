import { combineReducers } from 'redux';

import status from './zopimChat-status';
import connected from './zopimChat-connected';
import isChatting from './zopimChat-isChatting';

export default combineReducers({
  status,
  connected,
  isChatting
});

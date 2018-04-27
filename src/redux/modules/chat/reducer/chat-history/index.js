import { combineReducers } from 'redux';

import hasMore from './has-more';
import chats from './chats';
import requestStatus from './request-status';

export default combineReducers({
  hasMore,
  chats,
  requestStatus
});

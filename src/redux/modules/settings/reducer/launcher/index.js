import { combineReducers } from 'redux';

import setHideWhenChatOffline from './launcher-set-hide-when-chat-offline';
import badge from './launcher-badge-settings';

export default combineReducers({
  setHideWhenChatOffline,
  badge
});

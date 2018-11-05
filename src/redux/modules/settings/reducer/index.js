import { combineReducers } from 'redux';

import chat from './chat';
import analytics from './analytics';
import launcher from './launcher';

export default combineReducers({
  chat,
  analytics,
  launcher
});

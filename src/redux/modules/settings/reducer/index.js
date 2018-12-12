import { combineReducers } from 'redux';

import chat from './chat';
import analytics from './analytics';
import launcher from './launcher';
import color from './color';
import helpCenter from './help-center';

export default combineReducers({
  chat,
  analytics,
  launcher,
  color,
  helpCenter
});

import { combineReducers } from 'redux';

import chat from './chat';
import analytics from './analytics';

export default combineReducers({
  chat,
  analytics
});

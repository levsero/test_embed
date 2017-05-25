import { combineReducers } from 'redux';

import base from './base/reducer';
import chat from './chat/reducer';

export default combineReducers({
  base,
  chat
});

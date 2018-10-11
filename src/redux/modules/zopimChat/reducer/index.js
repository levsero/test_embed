import { combineReducers } from 'redux';

import status from './zopimChat-status';
import connected from './zopimChat-connected';

export default combineReducers({
  status,
  connected
});

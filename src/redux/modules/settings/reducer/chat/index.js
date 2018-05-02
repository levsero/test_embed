import { combineReducers } from 'redux';

import suppress from './chat-suppress';
import department from './chat-department';

export default combineReducers({
  suppress,
  department
});

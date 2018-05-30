import { combineReducers } from 'redux';

import enabled from './chat-departments-enabled';
import suppress from './chat-suppress';
import department from './chat-department';
import avatarPath from './chat-concierge-avatar';

export default combineReducers({
  suppress,
  department,
  avatarPath,
  departments: combineReducers({ enabled })
});

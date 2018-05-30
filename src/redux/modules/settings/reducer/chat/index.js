import { combineReducers } from 'redux';

import enabled from './chat-departments-enabled';
import suppress from './chat-suppress';
import department from './chat-department';
import avatarUrl from './chat-concierge-avatar';

export default combineReducers({
  suppress,
  department,
  avatarUrl,
  departments: combineReducers({ enabled })
});

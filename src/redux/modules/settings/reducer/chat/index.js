import { combineReducers } from 'redux';

import enabled from './chat-departments-enabled';
import suppress from './chat-suppress';
import department from './chat-department';

export default combineReducers({
  suppress,
  department,
  departments: combineReducers({ enabled })
});

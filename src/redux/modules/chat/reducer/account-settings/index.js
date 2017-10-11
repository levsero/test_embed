import { combineReducers } from 'redux';

import concierge from './concierge';
import preChatForm from './prechat-form';

export default combineReducers({
  concierge,
  preChatForm
});


import { combineReducers } from 'redux';

import concierge from './concierge';
import prechatForm from './prechat-form';

export default combineReducers({
  concierge,
  prechatForm
});


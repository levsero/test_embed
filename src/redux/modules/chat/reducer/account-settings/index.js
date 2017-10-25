import { combineReducers } from 'redux';

import concierge from './concierge';
import prechatForm from './prechat-form';
import postchatForm from './postchat-form';

export default combineReducers({
  concierge,
  prechatForm,
  postchatForm
});


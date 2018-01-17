import { combineReducers } from 'redux';

import attachments from './attachments';
import concierge from './concierge';
import prechatForm from './prechat-form';
import postchatForm from './postchat-form';

export default combineReducers({
  attachments,
  concierge,
  prechatForm,
  postchatForm
});


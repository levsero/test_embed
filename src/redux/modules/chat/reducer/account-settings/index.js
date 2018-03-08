import { combineReducers } from 'redux';

import attachments from './attachments';
import concierge from './concierge';
import offlineForm from './offline-form';
import prechatForm from './prechat-form';
import postchatForm from './postchat-form';
import rating from './rating';
import theme from './theme';

export default combineReducers({
  attachments,
  concierge,
  offlineForm,
  prechatForm,
  postchatForm,
  rating,
  theme
});


import { combineReducers } from 'redux';

import attachments from './attachments';
import concierge from './concierge';
import prechatForm from './prechat-form';
import postchatForm from './postchat-form';
import rating from './rating';
import theme from './theme';

export default combineReducers({
  attachments,
  concierge,
  prechatForm,
  postchatForm,
  rating,
  theme
});


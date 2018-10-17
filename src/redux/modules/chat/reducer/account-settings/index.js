import { combineReducers } from 'redux';

import attachments from './attachments';
import concierge from './concierge';
import offlineForm from './offline-form';
import prechatForm from './prechat-form';
import postchatForm from './postchat-form';
import rating from './rating';
import theme from './theme';
import login from './login';
import chatWindow from './chat-window';

export default combineReducers({
  attachments,
  concierge,
  offlineForm,
  prechatForm,
  postchatForm,
  rating,
  theme,
  login,
  chatWindow,
});


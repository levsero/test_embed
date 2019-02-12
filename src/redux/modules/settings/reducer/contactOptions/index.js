import { combineReducers } from 'redux';

import enabled from './enabled';
import contactButton from './contactButton';
import contactFormLabel from './contactFormLabel';
import chat from './chat-contactOptions';

export default combineReducers({
  enabled,
  chat,
  contactButton,
  contactFormLabel,
});

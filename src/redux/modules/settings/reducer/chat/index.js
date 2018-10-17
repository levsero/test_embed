import { combineReducers } from 'redux';

import enabled from './chat-departments-enabled';
import suppress from './chat-suppress';
import department from './chat-department';
import concierge from './chat-concierge';
import prechatForm from './chat-prechat-form';
import offlineForm from './chat-offline-form';
import title from './chat-title';
import mobileNotificationsDisabled from './chat-mobile-notifications-disabled';
import tags from './chat-tags';

export default combineReducers({
  suppress,
  department,
  concierge,
  prechatForm,
  offlineForm,
  title,
  departments: combineReducers({ enabled }),
  mobileNotificationsDisabled,
  tags
});

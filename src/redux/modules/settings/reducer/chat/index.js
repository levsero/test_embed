import { combineReducers } from 'redux';

import enabled from './chat-departments-enabled';
import select from './chat-departments-select';

import suppress from './chat-suppress';
import concierge from './chat-concierge';
import prechatForm from './chat-prechat-form';
import offlineForm from './chat-offline-form';
import title from './chat-title';
import mobileNotificationsDisabled from './chat-mobile-notifications-disabled';
import tags from './chat-tags';

export default combineReducers({
  suppress,
  concierge,
  prechatForm,
  offlineForm,
  title,
  departments: combineReducers({ enabled, select }),
  mobileNotificationsDisabled,
  tags
});

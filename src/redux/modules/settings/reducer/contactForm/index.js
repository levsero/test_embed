import { combineReducers } from 'redux';

import contactFormSettings from './contactForm-settings';

export default combineReducers({
  settings: contactFormSettings
});

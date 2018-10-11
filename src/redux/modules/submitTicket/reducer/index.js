import { combineReducers } from 'redux';

import formState from './submitTicket-formState';
import loading from './submitTicket-loading';
import ticketForms from './submitTicket-forms';
import ticketFields from './submitTicket-fields';
import activeForm from './submitTicket-activeForm';
import errorMsg from './submitTicket-errorMsg';
import notification from './submitTicket-notification';
import readOnlyState from './submitTicket-readOnlyState';

export default combineReducers({
  formState,
  loading,
  ticketForms,
  ticketFields,
  activeForm,
  errorMsg,
  notification,
  readOnlyState
});

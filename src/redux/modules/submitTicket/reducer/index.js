import { combineReducers } from 'redux';

import formState from './submitTicket-formState';
import loading from './submitTicket-loading';
import ticketForms from './submitTicket-forms';
import ticketFields from './submitTicket-fields';

export default combineReducers({
  formState,
  loading,
  ticketForms,
  ticketFields
});

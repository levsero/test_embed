import { combineReducers } from 'redux'

import formState from './submitTicket-formState'
import loading from './submitTicket-loading'
import ticketForms from './submitTicket-forms'
import ticketFields from './submitTicket-fields'
import activeForm from './submitTicket-activeForm'
import errorMsg from './submitTicket-errorMsg'
import notification from './submitTicket-notification'
import readOnlyState from './submitTicket-readOnlyState'

export default combineReducers({
  activeForm,
  errorMsg,
  formState,
  loading,
  notification,
  readOnlyState,
  ticketFields,
  ticketForms
})

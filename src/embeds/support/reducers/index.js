import { combineReducers } from 'redux'

import config from './config'
import formStates from './formStates'
import attachments from './attachments'
import attachmentLimitExceeded from './attachmentLimitExceeded'
import readOnly from './readOnly'
import displayDropzone from './displayDropzone'
import forms from './forms'
import fields from './fields'
import contactFormFields from './contactFormFields'
import filteredFormsToDisplay from 'embeds/support/reducers/filteredFormsToDisplay'
import ticketFormsSetViaAPI from 'embeds/support/reducers/ticketFormsSetViaAPI'
import allFormsRequested from 'embeds/support/reducers/allFormsRequested'
import ticketFormsRequest from 'embeds/support/reducers/ticketFormsRequest'
import isTicketFieldsLoading from 'embeds/support/reducers/isTicketFieldsLoading'
import isFormLoading from 'embeds/support/reducers/isFormLoading'

export default combineReducers({
  config,
  formStates,
  attachments,
  attachmentLimitExceeded,
  displayDropzone,
  readOnly,
  forms,
  fields,
  contactFormFields,
  filteredFormsToDisplay,
  ticketFormsSetViaAPI,
  allFormsRequested,
  ticketFormsRequest,
  isTicketFieldsLoading,
  isFormLoading
})

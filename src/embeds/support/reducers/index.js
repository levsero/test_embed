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
import formsWithSuppressedSubject from 'embeds/support/reducers/formsWithSuppressedSubject'
import fieldDescriptionOverrides from 'embeds/support/reducers/fieldDescriptionOverrides'
import ticketFormsRequest from 'embeds/support/reducers/ticketFormsRequest'
import isTicketFieldsLoading from 'embeds/support/reducers/isTicketFieldsLoading'
import isFormLoading from 'embeds/support/reducers/isFormLoading'
import formsWithSuppressedTitle from 'embeds/support/reducers/formsWithSuppressedTitle'

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
  formsWithSuppressedSubject,
  fieldDescriptionOverrides,
  ticketFormsRequest,
  isTicketFieldsLoading,
  isFormLoading,
  formsWithSuppressedTitle
})

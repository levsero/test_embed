import { combineReducers } from 'redux'
import allFormsRequested from 'src/embeds/support/reducers/allFormsRequested'
import fieldDescriptionOverrides from 'src/embeds/support/reducers/fieldDescriptionOverrides'
import filteredFormsToDisplay from 'src/embeds/support/reducers/filteredFormsToDisplay'
import formsWithSuppressedSubject from 'src/embeds/support/reducers/formsWithSuppressedSubject'
import formsWithSuppressedTitle from 'src/embeds/support/reducers/formsWithSuppressedTitle'
import isFormLoading from 'src/embeds/support/reducers/isFormLoading'
import isTicketFieldsLoading from 'src/embeds/support/reducers/isTicketFieldsLoading'
import ticketFormsRequest from 'src/embeds/support/reducers/ticketFormsRequest'
import ticketFormsSetViaAPI from 'src/embeds/support/reducers/ticketFormsSetViaAPI'
import attachmentLimitExceeded from './attachmentLimitExceeded'
import attachments from './attachments'
import config from './config'
import contactFormFields from './contactFormFields'
import displayDropzone from './displayDropzone'
import fields from './fields'
import formStates from './formStates'
import forms from './forms'
import readOnly from './readOnly'

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
  ticketFormsSetViaAPI,
  allFormsRequested,
  ticketFormsRequest,
  isTicketFieldsLoading,
  isFormLoading,
  formsWithSuppressedTitle,
})

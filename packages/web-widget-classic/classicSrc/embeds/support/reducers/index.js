import allFormsRequested from 'classicSrc/embeds/support/reducers/allFormsRequested'
import fieldDescriptionOverrides from 'classicSrc/embeds/support/reducers/fieldDescriptionOverrides'
import filteredFormsToDisplay from 'classicSrc/embeds/support/reducers/filteredFormsToDisplay'
import formsWithSuppressedSubject from 'classicSrc/embeds/support/reducers/formsWithSuppressedSubject'
import formsWithSuppressedTitle from 'classicSrc/embeds/support/reducers/formsWithSuppressedTitle'
import isFormLoading from 'classicSrc/embeds/support/reducers/isFormLoading'
import isTicketFieldsLoading from 'classicSrc/embeds/support/reducers/isTicketFieldsLoading'
import ticketFormsRequest from 'classicSrc/embeds/support/reducers/ticketFormsRequest'
import ticketFormsSetViaAPI from 'classicSrc/embeds/support/reducers/ticketFormsSetViaAPI'
import { combineReducers } from 'redux'
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

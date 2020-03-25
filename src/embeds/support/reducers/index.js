import { combineReducers } from 'redux'

import config from './config'
import formStates from './formStates'
import attachments from './attachments'
import attachmentLimitExceeded from './attachmentLimitExceeded'
import prefillValues from './prefillValues'
import readOnly from './readOnly'
import prefillId from './prefillId'
import prefillSpecificFormValues from './prefillSpecificFormValues'
import lastFormPrefillId from './lastFormPrefillId'
import displayDropzone from './displayDropzone'
import forms from './forms'
import fields from './fields'
import contactFormFields from './contactFormFields'
import isLoading from './isLoading'
import filteredFormsToDisplay from 'embeds/support/reducers/filteredFormsToDisplay'
import ticketFormsLoading from 'embeds/support/reducers/ticketFormsLoading'

export default combineReducers({
  config,
  formStates,
  attachments,
  attachmentLimitExceeded,
  prefillValues,
  displayDropzone,
  readOnly,
  prefillId,
  prefillSpecificFormValues,
  lastFormPrefillId,
  forms,
  fields,
  contactFormFields,
  isLoading,
  filteredFormsToDisplay,
  ticketFormsLoading
})

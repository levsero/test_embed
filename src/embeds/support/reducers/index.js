import { combineReducers } from 'redux'

import config from './config'
import formStates from './formStates'
import attachments from './attachments'
import attachmentLimitExceeded from './attachmentLimitExceeded'
import prefillValues from './prefillValues'
import readOnly from './readOnly'
import prefillId from './prefillId'
import prefillSpecificFormValues from 'embeds/support/reducers/prefillSpecificFormValues'
import lastFormPrefillId from 'embeds/support/reducers/lastFormPrefillId'
import displayDropzone from 'embeds/support/reducers/displayDropzone'
import forms from './forms'
import fields from './fields'
import contactFormFields from 'embeds/support/reducers/contactFormFields'

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
  contactFormFields
})

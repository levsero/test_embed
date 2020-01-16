import { combineReducers } from 'redux'

import config from './config'
import activeFormName from './activeFormName'
import formStates from './formStates'
import attachments from './attachments'
import attachmentLimitExceeded from './attachmentLimitExceeded'
import prefillValues from './prefillValues'
import readOnly from './readOnly'
import prefillId from './prefillId'
import prefillSpecificFormValues from 'embeds/support/reducers/prefillSpecificFormValues'
import lastFormPrefillId from 'embeds/support/reducers/lastFormPrefillId'

export default combineReducers({
  activeFormName,
  config,
  formStates,
  attachments,
  attachmentLimitExceeded,
  prefillValues,
  readOnly,
  prefillId,
  prefillSpecificFormValues,
  lastFormPrefillId
})

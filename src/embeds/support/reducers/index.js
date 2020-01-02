import { combineReducers } from 'redux'

import config from './config'
import activeFormName from './activeFormName'
import formStates from './formStates'
import attachments from './attachments'
import prefillValues from './prefillValues'
import readOnly from './readOnly'
import prefillTimestamp from './prefillTimestamp'

export default combineReducers({
  activeFormName,
  config,
  formStates,
  attachments,
  prefillValues,
  readOnly,
  prefillTimestamp
})

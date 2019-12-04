import { combineReducers } from 'redux'

import config from './config'
import activeFormName from './activeFormName'
import formStates from './formStates'
import attachments from './attachments'

export default combineReducers({
  activeFormName,
  config,
  formStates,
  attachments
})



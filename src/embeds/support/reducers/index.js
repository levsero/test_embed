import { combineReducers } from 'redux'

import config from './config'
import activeFormName from './activeFormName'
import formStates from './formStates'
export default combineReducers({
  activeFormName,
  config,
  formStates
})

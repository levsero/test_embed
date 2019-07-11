import { combineReducers } from 'redux'

import choice from './preview-choice'
import enabled from './preview-enabled'

export default combineReducers({
  choice,
  enabled
})

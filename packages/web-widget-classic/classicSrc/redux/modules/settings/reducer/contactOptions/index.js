import { combineReducers } from 'redux'
import chat from './chat-contactOptions'
import contactButton from './contactButton'
import contactFormLabel from './contactFormLabel'
import enabled from './enabled'

export default combineReducers({
  enabled,
  chat,
  contactButton,
  contactFormLabel,
})

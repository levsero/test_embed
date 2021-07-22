import { combineReducers } from 'redux'
import attachments from './attachments'
import banner from './banner'
import branding from './branding'
import chatWindow from './chat-window'
import concierge from './concierge'
import login from './login'
import offlineForm from './offline-form'
import operatingHours from './operating-hours'
import prechatForm from './prechat-form'
import rating from './rating'
import theme from './theme'

export default combineReducers({
  attachments,
  concierge,
  offlineForm,
  prechatForm,
  rating,
  theme,
  login,
  chatWindow,
  banner,
  branding,
  operatingHours,
})

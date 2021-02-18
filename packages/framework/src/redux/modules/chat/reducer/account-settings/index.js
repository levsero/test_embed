import { combineReducers } from 'redux'

import attachments from './attachments'
import concierge from './concierge'
import offlineForm from './offline-form'
import prechatForm from './prechat-form'
import rating from './rating'
import theme from './theme'
import login from './login'
import chatWindow from './chat-window'
import banner from './banner'
import branding from './branding'
import operatingHours from './operating-hours'

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

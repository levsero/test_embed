import { combineReducers } from 'redux'

import answerBot from './answerBot'
import chat from './chat'
import analytics from './analytics'
import cookies from './cookies'
import launcher from './launcher'
import color from './color'
import helpCenter from './help-center'
import styling from './styling'
import contactForm from './contactForm'
import talk from './talk'
import contactOptions from './contactOptions'
import navigation from './navigation'

export default combineReducers({
  analytics,
  answerBot,
  chat,
  color,
  cookies,
  contactForm,
  contactOptions,
  helpCenter,
  launcher,
  navigation,
  styling,
  talk
})

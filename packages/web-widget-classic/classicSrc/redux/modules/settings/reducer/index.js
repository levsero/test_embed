import { combineReducers } from 'redux'
import analytics from './analytics'
import answerBot from './answerBot'
import chat from './chat'
import color from './color'
import contactForm from './contactForm'
import contactOptions from './contactOptions'
import cookies from './cookies'
import helpCenter from './help-center'
import launcher from './launcher'
import navigation from './navigation'
import styling from './styling'
import talk from './talk'

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
  talk,
})

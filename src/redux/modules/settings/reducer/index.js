import { combineReducers } from 'redux';

import answerBot from './answerBot';
import chat from './chat';
import analytics from './analytics';
import launcher from './launcher';
import color from './color';
import helpCenter from './help-center';
import styling from './styling';
import contactForm from './contactForm';
import talk from './talk';
import contactOptions from './contactOptions';

export default combineReducers({
  answerBot,
  chat,
  analytics,
  launcher,
  color,
  helpCenter,
  styling,
  contactForm,
  talk,
  contactOptions
});

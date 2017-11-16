import { combineReducers } from 'redux';

import embeddableConfig from './talk-embeddable-config';
import agentAvailbility from './talk-agent-availability';
import screen from './talk-screen';
import formState from './talk-form-state';
import phoneNumber from './talk-phone-number';

export default combineReducers({
  embeddableConfig,
  agentAvailbility,
  screen,
  formState,
  phoneNumber
});

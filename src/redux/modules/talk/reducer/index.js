import { combineReducers } from 'redux';

import embeddableConfig from './talk-embeddable-config';
import agentAvailbility from './talk-agent-availability';
import screen from './talk-screen';
import formState from './talk-form-state';
import callback from './talk-callback';
import averageWaitTime from './talk-average-wait-time';

export default combineReducers({
  embeddableConfig,
  agentAvailbility,
  screen,
  formState,
  callback,
  averageWaitTime
});

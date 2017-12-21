import { combineReducers } from 'redux';

import embeddableConfig from './talk-embeddable-config';
import agentAvailability from './talk-agent-availability';
import screen from './talk-screen';
import formState from './talk-form-state';
import callback from './talk-callback';
import averageWaitTime from './talk-average-wait-time';
import averageWaitTimeEnabled from './talk-average-wait-time-enabled';

export default combineReducers({
  embeddableConfig,
  agentAvailability,
  screen,
  formState,
  callback,
  averageWaitTime,
  averageWaitTimeEnabled
});

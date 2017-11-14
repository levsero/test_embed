import { combineReducers } from 'redux';

import embeddableConfig from './embeddable-config';
import agentAvailbility from './agent-availability';

export default combineReducers({
  embeddableConfig,
  agentAvailbility
});

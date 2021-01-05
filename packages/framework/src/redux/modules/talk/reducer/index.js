import { combineReducers } from 'redux'

import embeddableConfig from './talk-embeddable-config'
import agentAvailability from './talk-agent-availability'
import formState from './talk-form-state'
import callback from './talk-callback'
import averageWaitTime from './talk-average-wait-time'
import vendor from './talk-vendor'
import isPolling from './talk-is-polling'
import microphoneMuted from 'embeds/talk/reducers/microphone-muted'

export default combineReducers({
  agentAvailability,
  averageWaitTime,
  callback,
  embeddableConfig,
  formState,
  isPolling,
  vendor,
  microphoneMuted
})

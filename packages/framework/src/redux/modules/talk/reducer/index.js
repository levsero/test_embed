import { combineReducers } from 'redux'

import embeddableConfig from './talk-embeddable-config'
import agentAvailability from './talk-agent-availability'
import formState from './talk-form-state'
import callback from './talk-callback'
import averageWaitTime from './talk-average-wait-time'
import vendor from './talk-vendor'
import isPolling from './talk-is-polling'
import recordingConsent from 'embeds/talk/reducers/recording-consent'
import microphoneMuted from 'embeds/talk/reducers/microphone-muted'
import timeInCall from 'embeds/talk/reducers/time-in-call'
import callInProgressLabel from 'embeds/talk/reducers/call-in-progress-label'

export default combineReducers({
  agentAvailability,
  averageWaitTime,
  callback,
  embeddableConfig,
  formState,
  isPolling,
  vendor,
  microphoneMuted,
  recordingConsent,
  timeInCall,
  callInProgressLabel
})

import { combineReducers } from 'redux'

import agentAvailability from './talk-agent-availability'
import averageWaitTime from './talk-average-wait-time'
import callback from './talk-callback'
import callInProgressLabel from 'embeds/talk/reducers/call-in-progress-label'
import embeddableConfig from './talk-embeddable-config'
import embeddedVoiceCallStatus from 'embeds/talk/reducers/embedded-voice-call-status'
import formState from './talk-form-state'
import isPolling from './talk-is-polling'
import microphoneMuted from 'embeds/talk/reducers/microphone-muted'
import recordingConsent from 'embeds/talk/reducers/recording-consent'
import timeInCall from 'embeds/talk/reducers/time-in-call'
import vendor from './talk-vendor'

export default combineReducers({
  agentAvailability,
  averageWaitTime,
  callback,
  callInProgressLabel,
  embeddableConfig,
  embeddedVoiceCallStatus,
  formState,
  isPolling,
  microphoneMuted,
  recordingConsent,
  timeInCall,
  vendor
})

import { combineReducers } from 'redux'
import embeddedVoiceCallStatus from 'src/embeds/talk/reducers/embedded-voice-call-status'
import microphoneMuted from 'src/embeds/talk/reducers/microphone-muted'
import recordingConsent from 'src/embeds/talk/reducers/recording-consent'
import timeInCall from 'src/embeds/talk/reducers/time-in-call'
import agentAvailability from './talk-agent-availability'
import averageWaitTime from './talk-average-wait-time'
import callback from './talk-callback'
import embeddableConfig from './talk-embeddable-config'
import formState from './talk-form-state'
import isPolling from './talk-is-polling'
import vendor from './talk-vendor'

export default combineReducers({
  agentAvailability,
  averageWaitTime,
  callback,
  embeddableConfig,
  embeddedVoiceCallStatus,
  formState,
  isPolling,
  microphoneMuted,
  recordingConsent,
  timeInCall,
  vendor,
})

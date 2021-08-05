import { combineReducers } from 'redux'
import embeddedVoiceCallStatus from 'src/embeds/talk/reducers/embedded-voice-call-status'
import microphoneMuted from 'src/embeds/talk/reducers/microphone-muted'
import recordingConsent from 'src/embeds/talk/reducers/recording-consent'
import agentAvailability from 'src/embeds/talk/reducers/talk-agent-availability'
import averageWaitTime from 'src/embeds/talk/reducers/talk-average-wait-time'
import callback from 'src/embeds/talk/reducers/talk-callback'
import embeddableConfig from 'src/embeds/talk/reducers/talk-embeddable-config'
import formState from 'src/embeds/talk/reducers/talk-form-state'
import isPolling from 'src/embeds/talk/reducers/talk-is-polling'
import vendor from 'src/embeds/talk/reducers/talk-vendor'
import timeInCall from 'src/embeds/talk/reducers/time-in-call'

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

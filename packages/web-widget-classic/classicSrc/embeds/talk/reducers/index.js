import embeddedVoiceCallStatus from 'classicSrc/embeds/talk/reducers/embedded-voice-call-status'
import microphoneMuted from 'classicSrc/embeds/talk/reducers/microphone-muted'
import recordingConsent from 'classicSrc/embeds/talk/reducers/recording-consent'
import agentAvailability from 'classicSrc/embeds/talk/reducers/talk-agent-availability'
import averageWaitTime from 'classicSrc/embeds/talk/reducers/talk-average-wait-time'
import callback from 'classicSrc/embeds/talk/reducers/talk-callback'
import embeddableConfig from 'classicSrc/embeds/talk/reducers/talk-embeddable-config'
import formState from 'classicSrc/embeds/talk/reducers/talk-form-state'
import isPolling from 'classicSrc/embeds/talk/reducers/talk-is-polling'
import vendor from 'classicSrc/embeds/talk/reducers/talk-vendor'
import timeInCall from 'classicSrc/embeds/talk/reducers/time-in-call'
import { combineReducers } from 'redux'

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

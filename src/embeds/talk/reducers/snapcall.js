import { combineReducers } from 'redux'
import {
  SNAPCALL_CALL_CONNECTED,
  SNAPCALL_CALL_DISCONNECTED,
  SNAPCALL_CALL_DISCONNECTED_NOTIFICATION_CLOSED,
  SNAPCALL_CALL_ENDED,
  SNAPCALL_CALL_ENDED_NOTIFICATION_CLOSED,
  SNAPCALL_CALL_FAILED,
  SNAPCALL_CALL_FAILED_NOTIFICATION_CLOSED,
  SNAPCALL_CALL_STARTED,
  SNAPCALL_MEDIA_REQUEST_FAILED,
  SNAPCALL_TIMER_UPDATED
} from 'src/embeds/talk/actions/action-types'
import { TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT } from 'src/redux/modules/talk/talk-action-types'
import snapcallSupported from './snapcall-supported'

const buttonIdInitialState = ''
const callStatusInitialState = 'inactive'
const callDurationInitialState = '0:00'

const buttonId = (state = buttonIdInitialState, action) => {
  const { type, payload } = action

  switch (type) {
    case TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT:
      return payload.snapcallButtonId || state
    default:
      return state
  }
}

const callStatus = (state = callStatusInitialState, action) => {
  const { type } = action

  switch (type) {
    case SNAPCALL_CALL_STARTED:
      return 'connecting'
    case SNAPCALL_CALL_CONNECTED:
      return 'active'
    case SNAPCALL_CALL_ENDED:
      return 'ended'
    case SNAPCALL_MEDIA_REQUEST_FAILED:
    case SNAPCALL_CALL_FAILED:
      return 'failed'
    case SNAPCALL_CALL_DISCONNECTED:
      return 'disconnected'
    case SNAPCALL_CALL_FAILED_NOTIFICATION_CLOSED:
    case SNAPCALL_CALL_DISCONNECTED_NOTIFICATION_CLOSED:
    case SNAPCALL_CALL_ENDED_NOTIFICATION_CLOSED:
      return callStatusInitialState
    default:
      return state
  }
}

const callDuration = (state = callDurationInitialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SNAPCALL_TIMER_UPDATED:
      return payload.callDuration
    case SNAPCALL_CALL_STARTED:
      return callDurationInitialState
    case SNAPCALL_CALL_ENDED_NOTIFICATION_CLOSED:
      return callDurationInitialState
    default:
      return state
  }
}

export default combineReducers({
  buttonId,
  callStatus,
  callDuration,
  snapcallSupported
})

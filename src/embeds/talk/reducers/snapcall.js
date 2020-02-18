import { combineReducers } from 'redux'
import {
  SNAPCALL_CALL_STARTED,
  SNAPCALL_CALL_CONNECTED,
  SNAPCALL_CALL_ENDED,
  SNAPCALL_CALL_DISCONNECTED,
  SNAPCALL_TIMER_UPDATED,
  SNAPCALL_CALL_ENDED_NOTIFICATION_CLOSED,
  SNAPCALL_CALL_FAILED,
  SNAPCALL_CALL_FAILED_NOTIFICATION_CLOSED,
  SNAPCALL_CALL_DISCONNECTED_NOTIFICATION_CLOSED
} from 'src/embeds/talk/actions/action-types'
import snapcallSupported from './snapcall-supported'

const callStatus = (state = 'inactive', action) => {
  const { type } = action

  switch (type) {
    case SNAPCALL_CALL_STARTED:
      return 'connecting'
    case SNAPCALL_CALL_CONNECTED:
      return 'active'
    case SNAPCALL_CALL_ENDED:
      return 'ended'
    case SNAPCALL_CALL_FAILED:
      return 'failed'
    case SNAPCALL_CALL_DISCONNECTED:
      return 'disconnected'
    case SNAPCALL_CALL_FAILED_NOTIFICATION_CLOSED:
    case SNAPCALL_CALL_DISCONNECTED_NOTIFICATION_CLOSED:
    case SNAPCALL_CALL_ENDED_NOTIFICATION_CLOSED:
      return 'inactive'
    default:
      return state
  }
}

const callDuration = (state = '0:00', action) => {
  const { type, payload } = action

  switch (type) {
    case SNAPCALL_TIMER_UPDATED:
      return payload.callDuration
    case SNAPCALL_CALL_STARTED:
      return '0:00'
    case SNAPCALL_CALL_ENDED_NOTIFICATION_CLOSED:
      return '0:00'
    default:
      return state
  }
}

export default combineReducers({
  callStatus,
  callDuration,
  snapcallSupported
})

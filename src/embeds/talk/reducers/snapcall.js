import { combineReducers } from 'redux'
import {
  SNAPCALL_CALL_STARTED,
  SNAPCALL_CALL_ENDED,
  SNAPCALL_TIMER_UPDATED,
  SNAPCALL_CALL_ENDED_NOTIFICATION_CLOSED
} from 'src/embeds/talk/actions/action-types'
import snapcallSupported from './snapcall-supported'

const callStatus = (state = null, action) => {
  const { type } = action

  switch (type) {
    case SNAPCALL_CALL_STARTED:
      return 'active'
    case SNAPCALL_CALL_ENDED:
      return null
    default:
      return state
  }
}

const previousCall = (state = false, action) => {
  const { type } = action

  switch (type) {
    case SNAPCALL_CALL_ENDED:
      return true
    case SNAPCALL_CALL_ENDED_NOTIFICATION_CLOSED:
      return false
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
    default:
      return state
  }
}

export default combineReducers({
  callStatus,
  previousCall,
  callDuration,
  snapcallSupported
})

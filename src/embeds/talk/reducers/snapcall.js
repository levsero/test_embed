import {
  SNAPCALL_CALL_STARTED,
  SNAPCALL_CALL_ENDED,
  SNAPCALL_TIMER_UPDATED,
  SNAPCALL_CALL_ENDED_NOTIFICATION_CLOSED
} from 'src/embeds/talk/actions/action-types'

const initialState = { callStatus: null, callDuration: '0:00', previousCall: false }

const snapcall = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SNAPCALL_CALL_STARTED:
      return {
        ...state,
        callStatus: 'active'
      }
    case SNAPCALL_CALL_ENDED:
      return {
        ...state,
        callStatus: null,
        previousCall: true
      }
    case SNAPCALL_TIMER_UPDATED:
      return {
        ...state,
        callDuration: payload.callDuration
      }
    case SNAPCALL_CALL_ENDED_NOTIFICATION_CLOSED:
      return {
        ...state,
        previousCall: false
      }
    default:
      return state
  }
}

export default snapcall

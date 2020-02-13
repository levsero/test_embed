import {
  SNAPCALL_CALL_ENDED,
  SNAPCALL_CALL_STARTED,
  SNAPCALL_TIMER_UPDATED,
  SNAPCALL_CALL_ENDED_NOTIFICATION_CLOSED
} from './action-types'

export const snapcallCallEnded = () => {
  return {
    type: SNAPCALL_CALL_ENDED
  }
}

export const snapcallCallStarted = () => {
  return {
    type: SNAPCALL_CALL_STARTED
  }
}

export const snapcallTimerUpdated = callDuration => {
  return {
    type: SNAPCALL_TIMER_UPDATED,
    payload: { callDuration }
  }
}

export const snapcallCallEndedNotificationClosed = () => {
  return {
    type: SNAPCALL_CALL_ENDED_NOTIFICATION_CLOSED
  }
}

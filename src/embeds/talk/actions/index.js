import errorTracker from 'service/errorTracker'

import {
  SNAPCALL_CALL_ENDED,
  SNAPCALL_CALL_STARTED,
  SET_SNAPCALL_SUPPORTED,
  SNAPCALL_CALL_CONNECTED,
  SNAPCALL_TIMER_UPDATED,
  SNAPCALL_CALL_ENDED_NOTIFICATION_CLOSED,
  SNAPCALL_CALL_FAILED_NOTIFICATION_CLOSED,
  SNAPCALL_CALL_FAILED,
  SNAPCALL_CALL_DISCONNECTED,
  SNAPCALL_CALL_DISCONNECTED_NOTIFICATION_CLOSED
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

export const snapcallCallConnected = () => {
  return {
    type: SNAPCALL_CALL_CONNECTED
  }
}

export const snapcallTimerUpdated = callDuration => {
  return {
    type: SNAPCALL_TIMER_UPDATED,
    payload: { callDuration }
  }
}

export const snapcallCallEndedNotificationClosed = () => ({
  type: SNAPCALL_CALL_ENDED_NOTIFICATION_CLOSED
})

export const snapcallCallDisconnected = () => ({
  type: SNAPCALL_CALL_DISCONNECTED
})

export const snapcallCallDisconnectedNotificationClosed = () => ({
  type: SNAPCALL_CALL_DISCONNECTED_NOTIFICATION_CLOSED
})

export const setSnapcallSupported = value => ({
  type: SET_SNAPCALL_SUPPORTED,
  payload: { snapcallSupported: value }
})

export const loadSnapcall = () => {
  return dispatch => {
    const onSuccess = ({ snapcallAPI }) => {
      snapcallAPI.widgetIsSupported(result => {
        if (result && result.hasWebRTC && result.hasMicrophone) {
          dispatch(setSnapcallSupported(true))
        } else {
          dispatch(setSnapcallSupported(false))
        }
      })
    }

    const onFailure = err => {
      dispatch(setSnapcallSupported(false))
      errorTracker.error(err)
    }

    return import(/* webpackChunkName: 'snapcall' */ 'snapcall')
      .then(onSuccess)
      .catch(onFailure)
  }
}

export const snapcallCallFailed = () => {
  return {
    type: SNAPCALL_CALL_FAILED
  }
}

export const snapcallCallFailedNotificationClosed = () => {
  return {
    type: SNAPCALL_CALL_FAILED_NOTIFICATION_CLOSED
  }
}

import { SNAPCALL_CALL_ENDED, SNAPCALL_CALL_STARTED } from './action-types'

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

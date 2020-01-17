import { END_SNAP_CALL } from './action-types'
import { snapcallAPI } from 'snapcall'

export const endSnapCall = () => {
  snapcallAPI.endCall()

  return {
    type: END_SNAP_CALL
  }
}

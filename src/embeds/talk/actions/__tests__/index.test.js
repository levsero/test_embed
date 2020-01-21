import { endSnapCall } from '../'
import { END_SNAP_CALL } from '../action-types'
import { snapcallAPI } from 'snapcall'

test('endSnapCall', () => {
  expect(endSnapCall()).toEqual({ type: END_SNAP_CALL })

  expect(snapcallAPI.endCall).toHaveBeenCalled()
})

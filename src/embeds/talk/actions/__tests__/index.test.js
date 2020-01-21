import { snapcallCallEnded, snapcallCallStarted } from '../'
import { SNAPCALL_CALL_ENDED, SNAPCALL_CALL_STARTED } from '../action-types'

test('snapcallCallEnded', () => {
  expect(snapcallCallEnded()).toEqual({ type: SNAPCALL_CALL_ENDED })
})

test('snapcallCallStarted', () => {
  expect(snapcallCallStarted()).toEqual({ type: SNAPCALL_CALL_STARTED })
})

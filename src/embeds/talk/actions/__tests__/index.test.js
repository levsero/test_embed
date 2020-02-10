import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { snapcallAPI } from 'snapcall'

import { snapcallCallEnded, snapcallCallStarted, setSnapcallSupported, loadSnapcall } from '../'
import { SNAPCALL_CALL_ENDED, SNAPCALL_CALL_STARTED, SET_SNAPCALL_SUPPORTED } from '../action-types'

const mockStore = configureMockStore([thunk])

test('snapcallCallEnded', () => {
  expect(snapcallCallEnded()).toEqual({ type: SNAPCALL_CALL_ENDED })
})

test('snapcallCallStarted', () => {
  expect(snapcallCallStarted()).toEqual({ type: SNAPCALL_CALL_STARTED })
})

test('setSnapcallSupported', () => {
  expect(setSnapcallSupported(true)).toEqual({
    type: SET_SNAPCALL_SUPPORTED,
    payload: { snapcallSupported: true }
  })
})

describe('loadSnapcall', () => {
  describe('when snapcall is not supported', () => {
    it('onSuccess dispatches a failure', async () => {
      const store = mockStore()
      snapcallAPI.widgetIsSupported.mockImplementation(callback =>
        callback({ hasWebRTC: false, hasMicrophone: false })
      )

      await store.dispatch(loadSnapcall())

      expect(store.getActions()[0]).toEqual({
        payload: { snapcallSupported: false },
        type: SET_SNAPCALL_SUPPORTED
      })
    })
  })

  describe('when snapcall is supported', () => {
    it('onSuccess dispatches a success', async () => {
      const store = mockStore()
      snapcallAPI.widgetIsSupported.mockImplementation(callback =>
        callback({ hasWebRTC: true, hasMicrophone: true })
      )

      await store.dispatch(loadSnapcall())

      expect(store.getActions()[0]).toEqual({
        payload: { snapcallSupported: true },
        type: SET_SNAPCALL_SUPPORTED
      })
    })
  })
})

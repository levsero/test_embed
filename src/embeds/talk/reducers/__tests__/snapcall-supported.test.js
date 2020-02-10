import { testReducer } from 'src/util/testHelpers'
import { SET_SNAPCALL_SUPPORTED } from 'src/embeds/talk/actions/action-types'
import snapcallSupported from 'src/embeds/talk/reducers/snapcall-supported'

testReducer(snapcallSupported, [
  {
    action: {
      type: 'initial state'
    },
    expected: null
  },
  {
    initialState: false,
    action: {
      type: SET_SNAPCALL_SUPPORTED,
      payload: { snapcallSupported: true }
    },
    expected: true
  },
  {
    initialState: true,
    action: {
      type: SET_SNAPCALL_SUPPORTED,
      payload: { snapcallSupported: false }
    },
    expected: false
  }
])

import vendor from '../talk-vendor'
import * as actionTypes from 'src/redux/modules/talk/talk-action-types'
import { testReducer } from 'src/util/testHelpers'

const initialState = {
  io: null,
  libphonenumber: null
}

testReducer(vendor, [
  {
    action: { type: undefined },
    expected: initialState
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { io: '123', libphonenumber: 'abc' },
    expected: { io: '123', libphonenumber: 'abc' }
  },
  {
    action: {
      type: actionTypes.TALK_VENDOR_LOADED,
      payload: { io: 'hello', libphonenumber: 'world' }
    },
    expected: { io: 'hello', libphonenumber: 'world' }
  }
])

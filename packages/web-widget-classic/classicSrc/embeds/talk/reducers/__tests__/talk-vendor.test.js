import * as actionTypes from 'classicSrc/embeds/talk/action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import vendor from '../talk-vendor'

const initialState = {
  io: null,
}

testReducer(vendor, [
  {
    action: { type: undefined },
    expected: initialState,
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { io: '123' },
    expected: { io: '123' },
  },
  {
    action: {
      type: actionTypes.TALK_VENDOR_LOADED,
      payload: { io: 'hello' },
    },
    expected: { io: 'hello' },
  },
])

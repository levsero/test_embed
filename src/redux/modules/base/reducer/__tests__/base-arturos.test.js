import baseArturos from '../base-arturos'
import { UPDATE_ARTUROS } from '../../base-action-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(baseArturos, [
  {
    action: { type: undefined },
    expected: {}
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { x: 1 },
    expected: { x: 1 }
  },
  {
    action: { type: UPDATE_ARTUROS, payload: { a: 1 } },
    initialState: { b: 3 },
    expected: { a: 1, b: 3 }
  }
])

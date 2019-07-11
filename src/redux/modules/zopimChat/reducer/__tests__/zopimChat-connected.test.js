import connected from '../zopimChat-connected'
import { ZOPIM_CONNECTED } from '../../zopimChat-action-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(connected, [
  {
    action: { type: undefined },
    expected: false
  },
  {
    action: { type: 'DERP DERP' },
    initialState: true,
    expected: true
  },
  {
    action: { type: ZOPIM_CONNECTED },
    expected: true
  }
])

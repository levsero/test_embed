import { testReducer } from 'classicSrc/util/testHelpers'
import { BOOT_UP_TIMER_COMPLETE } from '../../base-action-types'
import bootupTimeout from '../base-bootupTimeout'

testReducer(bootupTimeout, [
  {
    action: { type: undefined },
    expected: false,
  },
  {
    action: { type: 'DERP DERP' },
    initialState: true,
    expected: true,
  },
  {
    action: { type: BOOT_UP_TIMER_COMPLETE },
    expected: true,
  },
])

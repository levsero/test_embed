import bootupTimeout from '../base-bootupTimeout';
import { BOOT_UP_TIMER_COMPLETE } from '../../base-action-types';
import { testReducer } from 'src/util/testHelpers';

testReducer(bootupTimeout, [
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
    action: { type: BOOT_UP_TIMER_COMPLETE },
    expected: true
  }
]);

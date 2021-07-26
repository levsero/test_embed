import { testReducer } from 'src/util/testHelpers'
import { UPDATE_BACK_BUTTON_VISIBILITY } from '../../base-action-types'
import backButtonVisible from '../back-button-visibility'

testReducer(backButtonVisible, [
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
    action: { type: UPDATE_BACK_BUTTON_VISIBILITY, payload: false },
    initialState: true,
    expected: false,
  },
])

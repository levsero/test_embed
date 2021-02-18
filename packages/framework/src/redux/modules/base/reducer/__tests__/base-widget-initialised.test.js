import widgetInitialised from '../base-widget-initialised'
import { WIDGET_INITIALISED } from '../../base-action-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(widgetInitialised, [
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
    action: { type: WIDGET_INITIALISED },
    expected: true,
  },
])

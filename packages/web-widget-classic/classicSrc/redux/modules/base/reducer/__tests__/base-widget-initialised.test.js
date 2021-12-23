import { testReducer } from 'classicSrc/util/testHelpers'
import { WIDGET_INITIALISED } from '../../base-action-types'
import widgetInitialised from '../base-widget-initialised'

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

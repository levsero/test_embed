import searchAttempted from '../searchAttempted'
import { SEARCH_REQUEST_SENT } from 'embeds/helpCenter/actions/action-types'
import { testReducer } from 'src/util/testHelpers'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'

testReducer(searchAttempted, [
  {
    action: { type: undefined },
    initialState: false,
    expected: false
  },
  {
    action: { type: 'DERP' },
    initialState: false,
    expected: false
  },
  {
    action: { type: SEARCH_REQUEST_SENT },
    expected: true
  },
  {
    action: { type: SEARCH_REQUEST_SENT },
    initialState: false,
    expected: true
  },
  {
    action: { type: SEARCH_REQUEST_SENT },
    initialState: true,
    expected: true
  },
  {
    action: { type: API_RESET_WIDGET },
    initialState: true,
    expected: false
  }
])
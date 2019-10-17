import searchAttempted from '../searchAttempted'
import { SEARCH_REQUEST_SENT } from 'embeds/helpCenter/actions/action-types'
import { testReducer } from 'src/util/testHelpers'

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
  }
])

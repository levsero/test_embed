import * as actionTypes from 'src/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'
import lastSearchTimestamp from '../lastSearchTimestamp'

testReducer(lastSearchTimestamp, [
  {
    action: { type: undefined },
    expected: -1,
  },
  {
    action: { type: 'DERP DERP' },
    initialState: 123,
    expected: 123,
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_SENT,
      payload: {
        timestamp: 444,
      },
    },
    expected: 444,
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT,
      payload: {
        timestamp: 555,
      },
    },
    expected: 555,
  },
  {
    action: { type: API_RESET_WIDGET },
    initialState: 321,
    expected: -1,
  },
])

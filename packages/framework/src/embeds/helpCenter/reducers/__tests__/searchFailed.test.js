import * as actionTypes from 'src/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'
import searchFailed from '../searchFailed'

testReducer(searchFailed, [
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
    action: {
      type: actionTypes.SEARCH_REQUEST_FAILURE,
    },
    initialState: false,
    expected: true,
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_SENT,
    },
    initialState: true,
    expected: false,
  },
  {
    action: { type: API_RESET_WIDGET },
    initialState: true,
    expected: false,
  },
])

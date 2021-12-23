import * as actionTypes from 'classicSrc/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'classicSrc/redux/modules/base/base-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
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

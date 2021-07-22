import * as actionTypes from 'embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'
import resultsCount from '../resultsCount'

testReducer(resultsCount, [
  {
    action: { type: undefined },
    expected: 0,
  },
  {
    action: { type: 'DERP DERP' },
    initialState: 7,
    expected: 7,
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
      payload: {
        resultsCount: 5,
      },
    },
    initialState: 3,
    expected: 5,
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_SUCCESS,
      payload: {
        resultsCount: 50,
      },
    },
    expected: 50,
  },
  {
    action: { type: API_RESET_WIDGET },
    initialState: 45,
    expected: 0,
  },
])

import * as actionTypes from 'embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'
import loading from '../searchLoading'

testReducer(loading, [
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
      type: actionTypes.SEARCH_REQUEST_SENT,
    },
    initialState: false,
    expected: true,
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT,
    },
    initialState: false,
    expected: true,
  },
  {
    action: { type: API_RESET_WIDGET },
    initialState: true,
    expected: false,
  },
  {
    action: { type: actionTypes.SEARCH_REQUEST_SUCCESS },
    initialState: true,
    expected: false,
  },
  {
    action: { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS },
    initialState: true,
    expected: false,
  },
  {
    action: { type: actionTypes.SEARCH_REQUEST_FAILURE },
    initialState: true,
    expected: false,
  },
  {
    action: { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_FAILURE },
    initialState: true,
    expected: false,
  },
])

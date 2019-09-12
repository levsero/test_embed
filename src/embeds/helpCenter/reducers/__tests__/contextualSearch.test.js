import contextualSearch from '../contextualSearch'
import * as actionTypes from 'embeds/helpCenter/actions/action-types'
import { API_CLEAR_HC_SEARCHES } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

const initialState = {
  hasSearched: false,
  screen: ''
}

testReducer(contextualSearch, [
  {
    action: { type: undefined },
    expected: initialState
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { hasSearched: true, screen: 'blh' },
    expected: { hasSearched: true, screen: 'blh' }
  },
  {
    action: { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT },
    expected: {
      hasSearched: true,
      screen: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT
    }
  },
  {
    action: { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS },
    initialState: { hasSearched: true },
    expected: {
      hasSearched: true,
      screen: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS
    }
  },
  {
    action: { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_FAILURE },
    expected: {
      hasSearched: false,
      screen: actionTypes.CONTEXTUAL_SEARCH_REQUEST_FAILURE
    }
  },
  {
    action: { type: API_CLEAR_HC_SEARCHES },
    initialState: { hasSearched: true, screen: 'blh' },
    expected: initialState
  },
  {
    action: { type: actionTypes.SEARCH_REQUEST_SUCCESS },
    initialState: { hasSearched: true, screen: 'blh' },
    expected: initialState
  }
])
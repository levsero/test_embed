import * as actionTypes from 'classicSrc/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'classicSrc/redux/modules/base/base-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import contextualSearch from '../contextualSearch'

const initialState = {
  hasSearched: false,
  screen: '',
}

testReducer(contextualSearch, [
  {
    action: { type: undefined },
    expected: initialState,
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { hasSearched: true, screen: 'blh' },
    expected: { hasSearched: true, screen: 'blh' },
  },
  {
    action: { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT },
    expected: {
      hasSearched: true,
      screen: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT,
    },
  },
  {
    action: { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS },
    initialState: { hasSearched: true },
    expected: {
      hasSearched: true,
      screen: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
    },
  },
  {
    action: { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_FAILURE },
    expected: {
      hasSearched: false,
      screen: actionTypes.CONTEXTUAL_SEARCH_REQUEST_FAILURE,
    },
  },
  {
    action: { type: API_RESET_WIDGET },
    initialState: { hasSearched: true, screen: 'blh' },
    expected: initialState,
  },
])

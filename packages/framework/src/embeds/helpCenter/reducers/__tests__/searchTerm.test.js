import searchTerm from '../searchTerm'
import * as actionTypes from 'embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

const initialState = {
  current: '',
  previous: '',
}

testReducer(searchTerm, [
  {
    action: { type: undefined },
    expected: initialState,
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { current: 'h', previous: 'w' },
    expected: { current: 'h', previous: 'w' },
  },
  {
    action: { type: API_RESET_WIDGET },
    initialState: { current: 'h', previous: 'w' },
    expected: initialState,
  },
  {
    action: { type: actionTypes.SEARCH_REQUEST_SUCCESS },
    initialState: { current: 'hello' },
    expected: { previous: 'hello', current: 'hello' },
  },
  {
    action: { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_FAILURE },
    initialState: { current: 'hello' },
    expected: { previous: 'hello', current: 'hello' },
  },
  {
    action: { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS },
    initialState: { current: 'hello' },
    expected: { previous: 'hello', current: 'hello' },
  },
  {
    action: { type: actionTypes.SEARCH_REQUEST_FAILURE },
    initialState: { current: 'hello' },
    expected: { previous: 'hello', current: 'hello' },
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_SENT,
      payload: {
        searchTerm: 'help',
      },
    },
    initialState: { current: 'hello' },
    expected: { current: 'help' },
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT,
      payload: {
        searchTerm: 'help',
      },
    },
    expected: { current: 'help', previous: '' },
  },
])

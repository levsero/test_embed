import * as actionTypes from 'src/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'
import resultsLocale from '../resultsLocale'

testReducer(resultsLocale, [
  {
    action: { type: undefined },
    expected: '',
  },
  {
    action: { type: 'DERP DERP' },
    initialState: 'en',
    expected: 'en',
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
      payload: {
        locale: 'fr',
      },
    },
    initialState: 'br',
    expected: 'fr',
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_SUCCESS,
      payload: {
        locale: 'ar',
      },
    },
    expected: 'ar',
  },
  {
    action: { type: API_RESET_WIDGET },
    initialState: 'en',
    expected: '',
  },
])

import articleDisplayed from '../articleDisplayed'
import * as actionTypes from 'embeds/helpCenter/actions/action-types'
import { API_CLEAR_HC_SEARCHES } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(articleDisplayed, [
  {
    action: { type: undefined },
    expected: null
  },
  {
    action: { type: 'DERP DERP' },
    initialState: 123,
    expected: 123
  },
  {
    action: { type: actionTypes.GET_ARTICLE_REQUEST_SUCCESS, payload: { id: 123 } },
    expected: 123
  },
  {
    action: { type: actionTypes.GET_ARTICLE_REQUEST_SENT },
    expected: null
  },
  {
    action: { type: actionTypes.GET_ARTICLE_REQUEST_FAILURE },
    expected: null
  },
  {
    action: { type: API_CLEAR_HC_SEARCHES },
    initialState: 123,
    expected: null
  }
])

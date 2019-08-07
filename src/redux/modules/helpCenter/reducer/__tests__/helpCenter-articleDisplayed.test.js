import articleDisplayed from '../helpCenter-articleDisplayed'
import * as actionTypes from 'embeds/helpCenter/actions/action-types'
import { API_CLEAR_HC_SEARCHES } from '../../../base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(articleDisplayed, [
  {
    action: { type: undefined },
    expected: false
  },
  {
    action: { type: 'DERP DERP' },
    initialState: true,
    expected: true
  },
  {
    action: { type: actionTypes.GET_ARTICLE_REQUEST_SUCCESS },
    expected: true
  },
  {
    action: { type: actionTypes.GET_ARTICLE_REQUEST_SENT },
    expected: false
  },
  {
    action: { type: actionTypes.GET_ARTICLE_REQUEST_FAILURE },
    expected: false
  },
  {
    action: { type: API_CLEAR_HC_SEARCHES },
    initialState: true,
    expected: false
  }
])

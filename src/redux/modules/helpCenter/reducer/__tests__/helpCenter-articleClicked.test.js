import articleClicked from '../helpCenter-articleClicked'
import * as actionTypes from 'src/redux/modules/helpCenter/helpCenter-action-types'
import { API_CLEAR_HC_SEARCHES } from '../../../base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(articleClicked, [
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
    action: { type: actionTypes.ARTICLE_CLICKED },
    expected: true
  },
  {
    action: { type: actionTypes.ARTICLE_CLOSED },
    expected: false
  },
  {
    action: { type: actionTypes.SEARCH_REQUEST_SENT },
    expected: false
  },
  {
    action: { type: API_CLEAR_HC_SEARCHES },
    initialState: true,
    expected: false
  }
])

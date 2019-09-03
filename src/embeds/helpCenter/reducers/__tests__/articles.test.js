import articles from '../articles'
import * as actionTypes from 'embeds/helpCenter/actions/action-types'
import { API_CLEAR_HC_SEARCHES } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

const mockArticles = [{ id: 1, body: 'hello' }, { id: 2, body: 'world' }]

testReducer(articles, [
  {
    action: { type: undefined },
    expected: []
  },
  {
    action: { type: 'DERP DERP' },
    initialState: mockArticles,
    expected: mockArticles
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
      payload: { articles: mockArticles }
    },
    expected: mockArticles
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_SUCCESS,
      payload: { articles: mockArticles }
    },
    initialState: [],
    expected: mockArticles
  },
  {
    action: { type: actionTypes.SEARCH_REQUEST_FAILURE },
    expected: []
  },
  {
    action: { type: API_CLEAR_HC_SEARCHES },
    initialState: mockArticles,
    expected: []
  }
])

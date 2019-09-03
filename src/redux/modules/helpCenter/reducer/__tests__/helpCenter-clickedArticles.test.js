import articles from '../helpCenter-clickedArticles'
import * as actionTypes from 'embeds/helpCenter/actions/action-types'
import { API_CLEAR_HC_SEARCHES } from '../../../base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(articles, [
  {
    action: { type: undefined },
    expected: { current: null, previous: null }
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { current: 1, previous: 2 },
    expected: { current: 1, previous: 2 }
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS
    },
    initialState: { current: 2, previous: 3 },
    expected: { current: null, previous: null }
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_SUCCESS
    },
    initialState: { current: 2, previous: 3 },
    expected: { current: null, previous: null }
  },
  {
    action: {
      type: API_CLEAR_HC_SEARCHES
    },
    initialState: { current: 2, previous: 3 },
    expected: { current: null, previous: null }
  },
  {
    action: {
      type: actionTypes.ARTICLE_CLICKED,
      payload: { id: 123, body: 'body' }
    },
    initialState: { current: 2, previous: 3 },
    expected: { current: 123, previous: 3 }
  },
  {
    action: {
      type: actionTypes.ARTICLE_CLOSED
    },
    initialState: { current: 2, previous: 3 },
    expected: { current: null, previous: 2 }
  }
])

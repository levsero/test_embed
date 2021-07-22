import * as actionTypes from 'src/embeds/helpCenter/actions/action-types'
import { testReducer } from 'src/util/testHelpers'
import articles from '../articles'

const mockArticles = [
  { id: 1, body: 'hello' },
  { id: 2, body: 'world' },
]
const articleMap = {
  1: { id: 1, body: 'hello' },
  2: { id: 2, body: 'world' },
}

testReducer(articles, [
  {
    action: { type: undefined },
    expected: {},
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { a: 1 },
    expected: { a: 1 },
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
      payload: { articles: mockArticles },
    },
    expected: articleMap,
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_SUCCESS,
      payload: { articles: mockArticles },
    },
    initialState: {},
    expected: articleMap,
  },
  {
    action: {
      type: actionTypes.GET_ARTICLE_REQUEST_SUCCESS,
      payload: mockArticles[1],
    },
    initialState: { b: 2 },
    expected: {
      b: 2,
      2: { id: 2, body: 'world' },
    },
  },
])

import searchedArticles from '../searchedArticles'
import * as actionTypes from 'embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

const mockArticles = [
  { id: 1, body: 'hello' },
  { id: 2, body: 'world' },
]

testReducer(searchedArticles, [
  {
    action: { type: undefined },
    expected: [],
  },
  {
    action: { type: 'DERP DERP' },
    initialState: [3, 4],
    expected: [3, 4],
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
      payload: { articles: mockArticles },
    },
    expected: [1, 2],
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_SUCCESS,
      payload: { articles: mockArticles },
    },
    initialState: [],
    expected: [1, 2],
  },
  {
    action: { type: actionTypes.SEARCH_REQUEST_FAILURE },
    expected: [],
  },
  {
    action: { type: API_RESET_WIDGET },
    initialState: mockArticles,
    expected: [],
  },
])

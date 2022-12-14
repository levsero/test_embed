import * as actionTypes from 'classicSrc/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'classicSrc/redux/modules/base/base-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import articles from '../clickedArticles'

testReducer(articles, [
  {
    action: { type: undefined },
    expected: { current: null, previous: null },
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { current: 1, previous: 2 },
    expected: { current: 1, previous: 2 },
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
    },
    initialState: { current: 2, previous: 3 },
    expected: { current: null, previous: null },
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_SUCCESS,
    },
    initialState: { current: 2, previous: 3 },
    expected: { current: null, previous: null },
  },
  {
    action: {
      type: API_RESET_WIDGET,
    },
    initialState: { current: 2, previous: 3 },
    expected: { current: null, previous: null },
  },
  {
    action: {
      type: actionTypes.ARTICLE_VIEWED,
      payload: { id: 123, body: 'body' },
    },
    initialState: { current: 2, previous: 3 },
    expected: { current: 123, previous: 3 },
  },
  {
    action: {
      type: actionTypes.ARTICLE_CLOSED,
    },
    initialState: { current: 2, previous: 3 },
    expected: { current: null, previous: 2 },
  },
])

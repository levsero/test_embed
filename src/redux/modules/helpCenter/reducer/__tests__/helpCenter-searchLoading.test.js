import loading from '../helpCenter-searchLoading';
import * as actionTypes from 'src/redux/modules/helpCenter/helpCenter-action-types';
import { API_CLEAR_HC_SEARCHES } from '../../../base/base-action-types';
import { testReducer } from 'src/util/testHelpers';

testReducer(loading, [
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
    action: {
      type: actionTypes.SEARCH_REQUEST_SENT
    },
    initialState: false,
    expected: true
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT
    },
    initialState: false,
    expected: true
  },
  {
    action: {
      type: actionTypes.GET_ARTICLE_REQUEST_SENT
    },
    expected: true
  },
  {
    action: { type: API_CLEAR_HC_SEARCHES },
    initialState: true,
    expected: false
  },
  {
    action: { type: actionTypes.SEARCH_REQUEST_SUCCESS },
    initialState: true,
    expected: false
  },
  {
    action: { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS },
    initialState: true,
    expected: false
  },
  {
    action: { type: actionTypes.GET_ARTICLE_REQUEST_SUCCESS },
    initialState: true,
    expected: false
  },
  {
    action: { type: actionTypes.SEARCH_REQUEST_FAILURE },
    initialState: true,
    expected: false
  },
  {
    action: { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_FAILURE },
    initialState: true,
    expected: false
  },
  {
    action: { type: actionTypes.GET_ARTICLE_REQUEST_FAILURE },
    initialState: true,
    expected: false
  }
]);

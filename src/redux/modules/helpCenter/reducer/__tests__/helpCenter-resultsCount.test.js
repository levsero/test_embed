import resultsCount from '../helpCenter-resultsCount';
import * as actionTypes from 'src/redux/modules/helpCenter/helpCenter-action-types';
import { API_CLEAR_HC_SEARCHES } from '../../../base/base-action-types';
import { testReducer } from 'src/util/testHelpers';

testReducer(resultsCount, [
  {
    action: { type: undefined },
    expected: 0
  },
  {
    action: { type: 'DERP DERP' },
    initialState: 7,
    expected: 7
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
      payload: {
        resultsCount: 5
      }
    },
    initialState: 3,
    expected: 5
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_SUCCESS,
      payload: {
        resultsCount: 50
      }
    },
    expected: 50
  },
  {
    action: { type: API_CLEAR_HC_SEARCHES },
    initialState: 45,
    expected: 0
  }
]);

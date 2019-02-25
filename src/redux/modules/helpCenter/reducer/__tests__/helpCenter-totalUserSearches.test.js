import totalUserSearches from '../helpCenter-totalUserSearches';
import * as actionTypes from 'src/redux/modules/helpCenter/helpCenter-action-types';
import { API_CLEAR_HC_SEARCHES } from '../../../base/base-action-types';
import { testReducer } from 'src/util/testHelpers';

testReducer(totalUserSearches, [
  {
    action: { type: undefined },
    expected: 0
  },
  {
    action: { type: 'DERP DERP' },
    initialState: 5,
    expected: 5
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_SUCCESS
    },
    initialState: 4,
    expected: 5
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_FAILURE
    },
    expected: 1
  },
  {
    action: { type: API_CLEAR_HC_SEARCHES },
    initialState: 20,
    expected: 0
  }
]);

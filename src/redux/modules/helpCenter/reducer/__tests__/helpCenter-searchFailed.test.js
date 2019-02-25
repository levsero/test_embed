import searchFailed from '../helpCenter-searchFailed';
import * as actionTypes from 'src/redux/modules/helpCenter/helpCenter-action-types';
import { API_CLEAR_HC_SEARCHES } from '../../../base/base-action-types';
import { testReducer } from 'src/util/testHelpers';

testReducer(searchFailed, [
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
      type: actionTypes.SEARCH_REQUEST_FAILURE
    },
    initialState: false,
    expected: true
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_SENT,
    },
    initialState: true,
    expected: false
  },
  {
    action: { type: API_CLEAR_HC_SEARCHES },
    initialState: true,
    expected: false
  }
]);

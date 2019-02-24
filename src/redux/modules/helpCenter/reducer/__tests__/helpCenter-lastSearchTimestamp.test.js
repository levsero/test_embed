import lastSearchTimestamp from '../helpCenter-lastSearchTimestamp';
import * as actionTypes from 'src/redux/modules/helpCenter/helpCenter-action-types';
import { API_CLEAR_HC_SEARCHES } from '../../../base/base-action-types';
import { testReducer } from 'src/util/testHelpers';

testReducer(lastSearchTimestamp, [
  {
    action: { type: undefined },
    expected: -1
  },
  {
    action: { type: 'DERP DERP' },
    initialState: 123,
    expected: 123
  },
  {
    action: {
      type: actionTypes.SEARCH_REQUEST_SENT,
      payload: {
        timestamp: 444
      }
    },
    expected: 444
  },
  {
    action: {
      type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT,
      payload: {
        timestamp: 555
      }
    },
    expected: 555
  },
  {
    action: { type: API_CLEAR_HC_SEARCHES },
    initialState: 321,
    expected: -1
  }
]);

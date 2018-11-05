import { SEARCH_REQUEST_SENT, CONTEXTUAL_SEARCH_REQUEST_SENT } from '../helpCenter-action-types';
import { API_CLEAR_HC_SEARCHES } from '../../base/base-action-types';

const initialState = -1;

const lastSearchTimestamp = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_REQUEST_SENT:
    case CONTEXTUAL_SEARCH_REQUEST_SENT:
      return payload.timestamp;
    case API_CLEAR_HC_SEARCHES:
      return initialState;
    default:
      return state;
  }
};

export default lastSearchTimestamp;

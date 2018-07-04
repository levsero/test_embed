import { SEARCH_REQUEST_SENT, CONTEXTUAL_SEARCH_REQUEST_SENT } from '../helpCenter-action-types';

const initialState = -1;

const lastSearchTimestamp = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_REQUEST_SENT:
    case CONTEXTUAL_SEARCH_REQUEST_SENT:
      return payload.timestamp;
    default:
      return state;
  }
};

export default lastSearchTimestamp;

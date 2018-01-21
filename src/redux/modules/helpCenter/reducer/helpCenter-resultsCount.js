import { UPDATE_RESULTS } from '../helpCenter-action-types';

const initialState = 0;

const resultsCount = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_RESULTS:
      return payload.resultsCount;
    default:
      return state;
  }
};

export default resultsCount;

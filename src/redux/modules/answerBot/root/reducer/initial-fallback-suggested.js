import { BOT_INITIAL_FALLBACK } from '../action-types';

const initialState = false;

const initialFallbackSuggested = (state = initialState, action) => {
  switch (action.type) {
    case BOT_INITIAL_FALLBACK:
      return action.payload;
    default:
      return state;
  }
};

export default initialFallbackSuggested;

import { UPDATE_RESULTS } from '../helpCenter-action-types';

const initialState = [];

const articles = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_RESULTS:
      return payload.articles;
    default:
      return state;
  }
};

export default articles;

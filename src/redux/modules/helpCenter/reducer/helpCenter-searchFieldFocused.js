import { SEARCH_FIELD_FOCUSED } from '../helpCenter-action-types';

const initialState = false;

const searchFieldFocused = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_FIELD_FOCUSED:
      return payload;
    default:
      return state;
  }
};

export default searchFieldFocused;

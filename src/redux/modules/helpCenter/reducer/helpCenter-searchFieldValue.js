import { SEARCH_FIELD_CHANGED } from '../helpCenter-action-types';

const initialState = '';

const searchFieldValue = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_FIELD_CHANGED:
      return payload;
    default:
      return state;
  }
};

export default searchFieldValue;

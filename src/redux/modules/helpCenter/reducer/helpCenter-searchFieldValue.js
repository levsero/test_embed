import { UPDATE_SEARCH_FIELD_VALUE } from '../helpCenter-action-types';

const initialState = '';

const searchFieldValue = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SEARCH_FIELD_VALUE:
      return payload;
    default:
      return state;
  }
};

export default searchFieldValue;

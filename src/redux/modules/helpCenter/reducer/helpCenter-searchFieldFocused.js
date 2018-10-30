import { SEARCH_FIELD_FOCUSED } from '../helpCenter-action-types';
import { API_CLEAR_HC_SEARCHES } from '../../base/base-action-types';

const initialState = false;

const searchFieldFocused = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_FIELD_FOCUSED:
      return payload;
    case API_CLEAR_HC_SEARCHES:
      return initialState;
    default:
      return state;
  }
};

export default searchFieldFocused;

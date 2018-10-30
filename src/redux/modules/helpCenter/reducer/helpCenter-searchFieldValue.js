import { SEARCH_FIELD_CHANGED } from '../helpCenter-action-types';
import { API_CLEAR_HC_SEARCHES } from '../../base/base-action-types';

const initialState = '';

const searchFieldValue = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_FIELD_CHANGED:
      return payload;
    case API_CLEAR_HC_SEARCHES:
      return  initialState;
    default:
      return state;
  }
};

export default searchFieldValue;

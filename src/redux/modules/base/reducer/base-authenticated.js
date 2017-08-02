import { UPDATE_AUTHENTICATED } from '../base-action-types';

const initialState = false;

const authenticated = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_AUTHENTICATED:
      return payload;
    default:
      return state;
  }
};

export default authenticated;

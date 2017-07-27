import { UPDATE_HELP_CENTER_AUTHENTICATED } from '../helpCenter-action-types';

const initialState = false;

const authenticated = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case UPDATE_HELP_CENTER_AUTHENTICATED:
      return payload;
    default:
      return state;
  }
};

export default authenticated;

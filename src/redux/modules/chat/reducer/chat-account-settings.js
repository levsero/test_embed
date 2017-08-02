import { UPDATE_ACCOUNT_SETTINGS } from '../chat-action-types';

const initialState = {
  concierge: {}
};

const accountSettings = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ACCOUNT_SETTINGS:
      return action.payload;
    default:
      return state;
  }
};

export default accountSettings;

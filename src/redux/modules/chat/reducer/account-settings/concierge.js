import { UPDATE_ACCOUNT_SETTINGS } from '../../chat-action-types';

const initialState = {
  avatar_path: '',
  display_name: '',
  title: ''
};

const concierge = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ACCOUNT_SETTINGS:
      return action.payload.concierge;
    default:
      return state;
  }
};

export default concierge;

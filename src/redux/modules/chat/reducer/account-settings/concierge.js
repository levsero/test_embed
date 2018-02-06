import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../chat-action-types';

const initialState = {
  avatar_path: '',
  display_name: '',
  title: ''
};

const concierge = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return action.payload.concierge;
    default:
      return state;
  }
};

export default concierge;

import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../chat-action-types';

const initialState = {
  enabled: false
};

const rating = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return action.payload.rating;
    default:
      return state;
  }
};

export default rating;

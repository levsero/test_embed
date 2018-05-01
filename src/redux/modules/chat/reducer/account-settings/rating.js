import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS, UPDATE_PREVIEWER_SETTINGS } from '../../chat-action-types';

const initialState = {
  enabled: false
};

const rating = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
    case UPDATE_PREVIEWER_SETTINGS:
      return action.payload.rating;
    default:
      return state;
  }
};

export default rating;

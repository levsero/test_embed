import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../chat-action-types';

const initialState = {};

const login = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return {
        enabled: !action.payload.login.restrict_profile,
        phoneEnabled: action.payload.login.phone_display,
        loginTypes: action.payload.login.allowed_types
      };
    default:
      return state;
  }
};

export default login;

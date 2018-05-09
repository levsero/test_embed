import _ from 'lodash';
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS, UPDATE_PREVIEWER_SETTINGS } from '../../chat-action-types';

const initialState = {};

const login = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return {
        enabled: !action.payload.login.restrict_profile,
        phoneEnabled: action.payload.login.phone_display,
        loginTypes: action.payload.login.allowed_types
      };
    case UPDATE_PREVIEWER_SETTINGS:
      return {
        enabled: !_.get(action.payload, 'login.restrict_profile', state.enabled),
        phoneEnabled: _.get(action.payload, 'login.phone_display', state.phoneEnabled),
        loginTypes: _.get(action.payload, 'login.allowed_types', state.loginTypes)
      };
    default:
      return state;
  }
};

export default login;

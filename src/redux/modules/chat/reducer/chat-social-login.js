import {
  CHAT_SOCIAL_LOGIN_SUCCESS,
  CHAT_SOCIAL_LOGOUT_SUCCESS,
  CHAT_SOCIAL_LOGOUT_PENDING,
  CHAT_SOCIAL_LOGOUT_FAILURE
} from '../chat-action-types';

const initialState = {
  authenticated: false,
  screen: '',
  avatarPath: ''
};

const socialLogin = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case CHAT_SOCIAL_LOGIN_SUCCESS:
      return {
        ...state,
        avatarPath: payload,
        authenticated: true
      };
    case CHAT_SOCIAL_LOGOUT_SUCCESS:
      return {
        ...state,
        screen: type,
        avatarPath: '',
        authenticated: false
      };
    case CHAT_SOCIAL_LOGOUT_PENDING:
    case CHAT_SOCIAL_LOGOUT_FAILURE:
      return { ...state, screen: type };
    default:
      return state;
  }
};

export default socialLogin;

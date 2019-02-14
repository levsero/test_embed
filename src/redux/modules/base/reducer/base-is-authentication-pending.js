import {
  AUTHENTICATION_PENDING,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILURE,
  AUTHENTICATION_TOKEN_REVOKED,
  AUTHENTICATION_TOKEN_NOT_REVOKED
} from '../base-action-types';

const initialState = false;

const isAuthenticationPending = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case AUTHENTICATION_PENDING:
      return true;
    case AUTHENTICATION_SUCCESS:
    case AUTHENTICATION_FAILURE:
    case AUTHENTICATION_TOKEN_REVOKED:
    case AUTHENTICATION_TOKEN_NOT_REVOKED:
      return false;
    default:
      return state;
  }
};

export default isAuthenticationPending;

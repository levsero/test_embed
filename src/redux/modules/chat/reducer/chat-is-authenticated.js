import {
  AUTHENTICATION_STARTED,
  AUTHENTICATION_FAILED } from '../chat-action-types';

const initialState = false;

const isAuthenticated = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATION_STARTED:
      return true;
    case AUTHENTICATION_FAILED:
      return false;
    default:
      return state;
  }
};

export default isAuthenticated;

import {
  IS_AUTHENTICATED,
  IS_NOT_AUTHENTICATED } from '../chat-action-types';

const initialState = false;

const isAuthenticated = (state = initialState, action) => {
  switch (action.type) {
    case IS_AUTHENTICATED:
      return true;
    case IS_NOT_AUTHENTICATED:
      return false;
    default:
      return state;
  }
};

export default isAuthenticated;

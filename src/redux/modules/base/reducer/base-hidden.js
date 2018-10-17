import {
  ACTIVATE_RECIEVED,
  LEGACY_SHOW_RECIEVED,
  SHOW_RECIEVED,
  HIDE_RECIEVED } from '../base-action-types';

const initialState = {
  hideApi: false,
  activateApi: false
};

const hidden = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ACTIVATE_RECIEVED:
      if (payload.hideOnClose) {
        return {
          ...state,
          activateApi: true
        };
      }
      return state;
    case HIDE_RECIEVED:
      return {
        ...state,
        hideApi: true
      };
    case LEGACY_SHOW_RECIEVED:
    case SHOW_RECIEVED:
      return initialState;
    default:
      return state;
  }
};

export default hidden;

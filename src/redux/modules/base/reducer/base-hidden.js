import {
  ACTIVATE_RECEIVED,
  LEGACY_SHOW_RECEIVED,
  SHOW_RECEIVED,
  HIDE_RECEIVED } from '../base-action-types';

const initialState = {
  hideApi: false,
  activateApi: false
};

const hidden = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ACTIVATE_RECEIVED:
      if (payload.hideOnClose) {
        return {
          hideApi: false,
          activateApi: true
        };
      }
      return {
        ...state,
        hideApi: false
      };
    case HIDE_RECEIVED:
      return {
        activateApi: true,
        hideApi: true
      };
    case LEGACY_SHOW_RECEIVED:
    case SHOW_RECEIVED:
      return initialState;
    default:
      return state;
  }
};

export default hidden;

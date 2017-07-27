import {
  UPDATE_EMBED,
  UPDATE_HELP_CENTER_EMBED } from '../base-action-types';

const initialState = [];
const helpCenterDefaults = {
  accessible: false,
  authenticated: false
};

const embeds = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_EMBED:
      return {
        ...state,
        [payload.name]: {
          accessible: false,
          ...state[payload.name],
          ...payload.params
        }
      };
    case UPDATE_HELP_CENTER_EMBED:
      return {
        ...state,
        'helpCenterForm': {
          ...helpCenterDefaults,
          ...state.helpCenterForm,
          ...payload
        }
      };
    default:
      return state;
  }
};

export default embeds;

import { UPDATE_EMBED } from '../base-action-types';

const initialState = [];

const embeds = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_EMBED:
      return {
        ...state,
        [payload.detail.name]: {
          ...state[payload.detail.name],
          ...payload.detail
        }
      };
    default:
      return state;
  }
};

export default embeds;

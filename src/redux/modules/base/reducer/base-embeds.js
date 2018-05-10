import { UPDATE_EMBED } from '../base-action-types';

const initialState = {};
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
    default:
      return state;
  }
};

export default embeds;

import { UPDATE_ACTIVE_EMBED } from '../base-action-types';

const initialState = '';

const activeEmbed = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_ACTIVE_EMBED:
      return payload;
    default:
      return state;
  }
};

export default activeEmbed;

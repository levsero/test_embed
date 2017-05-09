import { UPDATE_ACTIVE_EMBED } from '../base-action-types';

const initialState = '';

const activeEmbed = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ACTIVE_EMBED:
      return action.payload.detail;
    default:
      return state;
  }
};

export default activeEmbed;

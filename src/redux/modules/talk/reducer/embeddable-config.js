import { TALK_EMBEDDABLE_CONFIG } from '../talk-action-types';

const initialState = {};

const embeddableConfig = (state = initialState, action) => {
  switch (action.type) {
    case TALK_EMBEDDABLE_CONFIG:
      return action.payload;
    default:
      return state;
  }
};

export default embeddableConfig;

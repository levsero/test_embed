import { TALK_AGENT_AVAILABILITY } from '../talk-action-types';

const initialState = {
  available: false
};

const agentAvailbility = (state = initialState, action) => {
  switch (action.type) {
    case TALK_AGENT_AVAILABILITY:
      return action.payload;
    default:
      return state;
  }
};

export default agentAvailbility;

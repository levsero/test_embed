import { UPDATE_TALK_AGENT_AVAILABILITY } from '../talk-action-types';

const initialState = false;

const agentAvailbility = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TALK_AGENT_AVAILABILITY:
      return action.payload === 'true';
    default:
      return state;
  }
};

export default agentAvailbility;

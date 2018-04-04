import { UPDATE_LAST_AGENT_MESSAGE_SEEN_TIMESTAMP } from '../chat-action-types';

const initialState = null;

const lastAgentMessageSeenTimestamp = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_LAST_AGENT_MESSAGE_SEEN_TIMESTAMP:
      return payload;
    default:
      return state;
  }
};

export default lastAgentMessageSeenTimestamp;

import {
  NEW_AGENT_MESSAGE_RECEIVED,
  CHAT_MSG_REQUEST_SUCCESS,
  END_CHAT_REQUEST_SUCCESS,
  CHAT_RECONNECT
} from '../chat-action-types';

const initialState = null;

const sessionTimestamp = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case NEW_AGENT_MESSAGE_RECEIVED:
    case CHAT_MSG_REQUEST_SUCCESS:
      return payload.timestamp;
    case END_CHAT_REQUEST_SUCCESS:
    case CHAT_RECONNECT:
      return initialState;
    default:
      return state;
  }
};

export default sessionTimestamp;

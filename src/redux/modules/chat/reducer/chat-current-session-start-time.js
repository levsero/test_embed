import {
  END_CHAT_REQUEST_SUCCESS,
  CHAT_RECONNECT,
  SDK_CHAT_MSG
} from '../chat-action-types';

const initialState = null;

const currentSessionStartTime = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SDK_CHAT_MSG:
      if (!state) {
        return payload.detail.timestamp;
      }
      return state;
    case END_CHAT_REQUEST_SUCCESS:
    case CHAT_RECONNECT:
      return initialState;
    default:
      return state;
  }
};

export default currentSessionStartTime;

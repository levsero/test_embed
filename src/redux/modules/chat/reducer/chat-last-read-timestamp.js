import { SDK_CHAT_LAST_READ } from '../chat-action-types';

const initialState = Date.now();

const lastReadTimestamp = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case SDK_CHAT_LAST_READ:
      return payload.detail.timestamp;
    default:
      return state;
  }
};

export default lastReadTimestamp;

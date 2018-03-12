import { SDK_CHAT_QUEUE_POSITION } from '../chat-action-types';

const initialState = 0;

const queuePosition = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case SDK_CHAT_QUEUE_POSITION:
      return payload.detail.queue_position;
    default:
      return state;
  }
};

export default queuePosition;

import { SDK_CONNECTION_UPDATE, CHAT_CONNECTION_ERROR, CHAT_BANNED } from '../chat-action-types';
import { CONNECTION_STATUSES } from 'constants/chat';

const initialState = '';

const connection = (state = initialState, action) => {
  switch (action.type) {
    case SDK_CONNECTION_UPDATE:
      return action.payload.detail;
    case CHAT_CONNECTION_ERROR:
    case CHAT_BANNED:
      return CONNECTION_STATUSES.CLOSED;
    default:
      return state;
  }
};

export default connection;

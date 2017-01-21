import { SDK_CONNECTION_UPDATE } from '../chat-action-types';

const initialState = '';

const connection = (state = initialState, action) => {
  switch (action.type) {
    case SDK_CONNECTION_UPDATE:
      return action.payload.detail;
    default:
      return state;
  }
}

export default connection;

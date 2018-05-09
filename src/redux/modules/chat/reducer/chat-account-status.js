import { SDK_ACCOUNT_STATUS, UPDATE_PREVIEWER_SCREEN } from '../chat-action-types';

const initialState = '';

const accountStatus = (state = initialState, action) => {
  switch (action.type) {
    case SDK_ACCOUNT_STATUS:
      return action.payload.detail;
    case UPDATE_PREVIEWER_SCREEN:
      return action.payload.status;
    default:
      return state;
  }
};

export default accountStatus;

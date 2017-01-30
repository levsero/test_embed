import { SDK_ACCOUNT_STATUS } from '../chat-action-types';

const initialState = '';

const accountStatus = (state = initialState, action) => {
  switch (action.type) {
    case SDK_ACCOUNT_STATUS:
      return action.payload.detail;
    default:
      return state;
  }
};

export default accountStatus;

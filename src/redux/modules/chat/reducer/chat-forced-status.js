import { API_FORCE_STATUS_CALLED } from '../chat-action-types';

const initialState = null;

const forcedStatus = (state = initialState, action) => {
  switch (action.type) {
    case API_FORCE_STATUS_CALLED:
      return action.payload;
    default:
      return state;
  }
};

export default forcedStatus;

import { SESSION_STARTED } from '../../sessions/action-types';

const initialState = null;

const currentSessionID = (state = initialState, action) => {
  switch (action.type) {
    case SESSION_STARTED:
      return action.payload.sessionID;
    default:
      return state;
  }
};

export default currentSessionID;

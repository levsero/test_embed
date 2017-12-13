import { UPDATE_TALK_AVERAGE_WAIT_TIME } from '../talk-action-types';

const initialState = '0';

const averageWaitTime = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TALK_AVERAGE_WAIT_TIME:
      return action.payload || state;
    default:
      return state;
  }
};

export default averageWaitTime;

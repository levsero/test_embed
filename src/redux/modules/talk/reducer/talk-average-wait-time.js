import { TALK_AVERAGE_WAIT_TIME } from '../talk-action-types';

const initialState = '0';

const averageWaitTime = (state = initialState, action) => {
  switch (action.type) {
    case TALK_AVERAGE_WAIT_TIME:
      return action.payload;
    default:
      return state;
  }
};

export default averageWaitTime;

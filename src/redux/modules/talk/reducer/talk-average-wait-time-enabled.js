import { UPDATE_TALK_AVERAGE_WAIT_TIME_ENABLED } from '../talk-action-types';

const initialState = false;

const averageWaitTimeEnabled = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TALK_AVERAGE_WAIT_TIME_ENABLED:
      return action.payload;
    default:
      return state;
  }
};

export default averageWaitTimeEnabled;

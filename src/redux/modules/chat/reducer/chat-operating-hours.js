import { GET_OPERATING_HOURS_REQUEST_SUCCESS } from '../chat-action-types';

const initialState = { enabled: false };

const operatingHours = (state = initialState, action) => {
  switch (action.type) {
    case GET_OPERATING_HOURS_REQUEST_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export default operatingHours;

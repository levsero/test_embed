import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../chat-action-types';

const initialState = {
  display_notice: false
};

const operatingHours = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return action.payload.operating_hours;
    default:
      return state;
  }
};

export default operatingHours;

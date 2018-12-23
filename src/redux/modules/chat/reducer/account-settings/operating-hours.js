import _ from 'lodash';
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../chat-action-types';

const initialState = {
  display_notice: false
};

const operatingHours = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return _.get(action.payload, 'operating_hours', state);
    default:
      return state;
  }
};

export default operatingHours;

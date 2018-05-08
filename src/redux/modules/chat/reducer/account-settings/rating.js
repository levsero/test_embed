import _ from 'lodash';
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS, UPDATE_PREVIEWER_SETTINGS } from '../../chat-action-types';

const initialState = {
  enabled: false
};

const rating = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return action.payload.rating;
    case UPDATE_PREVIEWER_SETTINGS:
      return _.get(action.payload, 'rating', state);
    default:
      return state;
  }
};

export default rating;

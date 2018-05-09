import _ from 'lodash';
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS, UPDATE_PREVIEWER_SETTINGS } from '../../chat-action-types';

const initialState = {
  message_type: ''
};

const theme = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return { message_type: action.payload.theme.message_type };
    case UPDATE_PREVIEWER_SETTINGS:
      return { message_type: _.get(action.payload, 'theme.message_type', state.message_type) };
    default:
      return state;
  }
};

export default theme;

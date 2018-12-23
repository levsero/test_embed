import _ from 'lodash';
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS, UPDATE_PREVIEWER_SETTINGS } from '../../chat-action-types';

const defaultAllowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'txt', 'pdf'];
const initialState = {
  allowed_extensions: defaultAllowedExtensions.join(),
  enabled: true
};

const attachments = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
    case UPDATE_PREVIEWER_SETTINGS:
      return _.get(action.payload, 'file_sending', state);
    default:
      return state;
  }
};

export default attachments;

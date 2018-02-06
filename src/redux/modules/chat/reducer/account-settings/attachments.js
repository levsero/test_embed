import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../chat-action-types';

const defaultAllowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'txt', 'pdf'];
const initialState = {
  allowed_extensions: defaultAllowedExtensions.join(),
  enabled: true
};

const attachments = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return action.payload.file_sending;
    default:
      return state;
  }
};

export default attachments;

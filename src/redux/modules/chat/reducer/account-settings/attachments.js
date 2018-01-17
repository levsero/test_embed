import { UPDATE_ACCOUNT_SETTINGS } from '../../chat-action-types';

const defaultAllowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'txt', 'pdf'];
const initialState = {
  allowed_extensions: defaultAllowedExtensions.join(),
  enabled: true
};

const attachments = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ACCOUNT_SETTINGS:
      return action.payload.file_sending;
    default:
      return state;
  }
};

export default attachments;

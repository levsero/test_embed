import { UPDATE_ACCOUNT_SETTINGS } from '../../chat-action-types';

const initialState = {
  header: '',
  message: ''
};

const postchatForm = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ACCOUNT_SETTINGS:
      const { header, message } = action.payload.forms.post_chat_form;

      return {
        header: header.toString(),
        message: message.toString()
      };
    default:
      return state;
  }
};

export default postchatForm;

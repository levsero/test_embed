import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../chat-action-types';

const initialState = {
  header: '',
  message: ''
};

const postchatForm = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      const { header, message } = action.payload.forms.post_chat_form;

      return {
        header: header ? header.toString() : '',
        message: message ? message.toString(): ''
      };
    default:
      return state;
  }
};

export default postchatForm;

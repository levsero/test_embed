import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../chat-action-types';

const initialState = {
  form: {
    name: { name: 'name', required: false },
    email: { name: 'email', required: false },
    phone: { name: 'phone', required: false },
    message: { name: 'message', required: false }
  },
  message: '',
  profile_required: false,
  required: false
};

const prechatForm = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return action.payload.forms.pre_chat_form;
    default:
      return state;
  }
};

export default prechatForm;

import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../chat-action-types';

const initialFieldProps = { name: '', required: false };
const initialState = {
  form: {
    name: initialFieldProps,
    email: initialFieldProps,
    phone: initialFieldProps,
    message: initialFieldProps
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

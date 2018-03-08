import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../chat-action-types';

const initialFieldProps = { name: '', required: false };
const initialState = {
  form: {
    name: initialFieldProps,
    email: initialFieldProps,
    phone: initialFieldProps,
    message: initialFieldProps
  }
};

const offlineForm = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return action.payload.forms.offline_form;
    default:
      return state;
  }
};

export default offlineForm;

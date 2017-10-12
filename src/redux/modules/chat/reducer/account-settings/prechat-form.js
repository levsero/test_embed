import { UPDATE_ACCOUNT_SETTINGS } from '../../chat-action-types';

const initialState = {
  form: {},
  message: '',
  profile_required: false,
  required: false
};

const prechatForm = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ACCOUNT_SETTINGS:
      return action.payload.forms.pre_chat_form;
    default:
      return state;
  }
};

export default prechatForm;

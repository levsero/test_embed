import _ from 'lodash';
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS, UPDATE_PREVIEWER_SETTINGS } from '../../chat-action-types';

const initialState = {
  form: {
    name: { name: 'name', required: false },
    email: { name: 'email', required: false },
    phone: { name: 'phone', required: false },
    message: { name: 'message', required: false }
  },
  enabled: false,
  message: ''
};

const offlineForm = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return {
        ...action.payload.forms.offline_form,
        enabled: !action.payload.chat_button.hide_when_offline
      };
    case UPDATE_PREVIEWER_SETTINGS:
      return {
        ..._.get(action.payload, 'forms.offline_form', state.form),
        enabled: !_.get(action.payload, 'chat_button.hide_when_offline', state.enabled)
      };
    default:
      return state;
  }
};

export default offlineForm;

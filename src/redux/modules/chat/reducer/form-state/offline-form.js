import { CHAT_OFFLINE_FORM_CHANGED, OFFLINE_FORM_BACK_BUTTON_CLICKED } from '../../chat-action-types';
import { IDENTIFY_RECIEVED, API_CLEAR_FORM } from '../../../base/base-action-types';

const initialState = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const offlineForm = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_OFFLINE_FORM_CHANGED:
      return {
        ...initialState,
        ...action.payload
      };
    case IDENTIFY_RECIEVED:
      return { ...state, ...action.payload };
    case OFFLINE_FORM_BACK_BUTTON_CLICKED:
      return { ...state, message: '' };
    case API_CLEAR_FORM:
      return initialState;
    default:
      return state;
  }
};

export default offlineForm;

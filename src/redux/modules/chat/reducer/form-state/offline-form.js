import { CHAT_OFFLINE_FORM_CHANGED, OFFLINE_FORM_BACK_BUTTON_CLICKED } from '../../chat-action-types';
import { PREFILL_RECEIVED, API_CLEAR_FORM } from '../../../base/base-action-types';

const initialState = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const offlineForm = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CHAT_OFFLINE_FORM_CHANGED:
      return {
        ...initialState,
        ...payload
      };
    case PREFILL_RECEIVED:
      return {
        ...state,
        ...payload.prefillValues
      };
    case OFFLINE_FORM_BACK_BUTTON_CLICKED:
      return { ...state, message: '' };
    case API_CLEAR_FORM:
      return initialState;
    default:
      return state;
  }
};

export default offlineForm;

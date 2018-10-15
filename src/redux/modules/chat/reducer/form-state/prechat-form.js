import { PRE_CHAT_FORM_ON_CHANGE } from '../../chat-action-types';
import { PREFILL_RECEIVED, API_CLEAR_FORM } from '../../../base/base-action-types';

const initialState = {
  name: '',
  email: '',
  phone: '',
  department: '',
  message: ''
};

const preChatForm = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case PREFILL_RECEIVED:
      return {
        ...state,
        ...payload.prefillValues
      };
    case PRE_CHAT_FORM_ON_CHANGE:
      return { ...state, ...payload };
    case API_CLEAR_FORM:
      return initialState;
    default:
      return state;
  }
};

export default preChatForm;

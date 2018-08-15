import { PRE_CHAT_FORM_ON_CHANGE } from '../../chat-action-types';
import { IDENTIFY_RECIEVED } from '../../../base/base-action-types';

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
    case IDENTIFY_RECIEVED:
    case PRE_CHAT_FORM_ON_CHANGE:
      return { ...state, ...payload };
    default:
      return state;
  }
};

export default preChatForm;

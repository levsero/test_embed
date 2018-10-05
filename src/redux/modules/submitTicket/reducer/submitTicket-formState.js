import { FORM_ON_CHANGE } from '../submitTicket-action-types';
import { IDENTIFY_RECIEVED, API_CLEAR_FORM } from '../../base/base-action-types';

const initialState = {
  name: '',
  subject: '',
  email: '',
  description: ''
};

const formState = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FORM_ON_CHANGE:
      return {
        ...initialState,
        ...payload
      };
    case IDENTIFY_RECIEVED:
      return {
        ...state,
        ...payload
      };
    case API_CLEAR_FORM:
      return initialState;
    default:
      return state;
  }
};

export default formState;

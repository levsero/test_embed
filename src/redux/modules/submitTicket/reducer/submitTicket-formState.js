import { FORM_ON_CHANGE } from '../submitTicket-action-types';
import { IDENTIFY_RECIEVED } from '../../base/base-action-types';

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
    default:
      return state;
  }
};

export default formState;

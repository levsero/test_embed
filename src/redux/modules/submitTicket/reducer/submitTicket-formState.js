import { FORM_ON_CHANGE } from '../submitTicket-action-types';
import { PREFILL_RECEIVED, API_CLEAR_FORM } from '../../base/base-action-types';

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
    case PREFILL_RECEIVED:
      return {
        ...state,
        ...payload.prefillValues
      };
    case API_CLEAR_FORM:
      return initialState;
    default:
      return state;
  }
};

export default formState;

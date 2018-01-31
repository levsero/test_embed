import { FORM_ON_CHANGE } from '../submitTicket-action-types';

const initialState = {};

const formState = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FORM_ON_CHANGE:
      return payload;
    default:
      return state;
  }
};

export default formState;

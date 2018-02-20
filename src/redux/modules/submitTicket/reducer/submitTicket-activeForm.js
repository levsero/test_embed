import { TICKET_FORM_UPDATE } from '../submitTicket-action-types';

const initialState = null;

const activeForm = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case TICKET_FORM_UPDATE:
      return payload;
    default:
      return state;
  }
};

export default activeForm;

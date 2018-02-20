import { TICKET_FORMS_REQUEST_SUCCESS } from '../submitTicket-action-types';

const initialState = [];

const forms = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case TICKET_FORMS_REQUEST_SUCCESS:
      return payload.ticket_forms;
    default:
      return state;
  }
};

export default forms;

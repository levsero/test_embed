import { TICKET_FIELDS_REQUEST_SUCCESS, TICKET_FORMS_REQUEST_SUCCESS } from '../submitTicket-action-types';

const initialState = [];

const fields = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case TICKET_FIELDS_REQUEST_SUCCESS:
      return payload;
    case TICKET_FORMS_REQUEST_SUCCESS:
      return payload.ticket_fields;
    default:
      return state;
  }
};

export default fields;

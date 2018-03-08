import {
  TICKET_SUBMISSION_REQUEST_FAILURE,
  TICKET_SUBMISSION_REQUEST_SENT } from '../submitTicket-action-types';

const initialState = '';

const errorMsg = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case TICKET_SUBMISSION_REQUEST_FAILURE:
      return payload;
    case TICKET_SUBMISSION_REQUEST_SENT:
      return '';
    default:
      return state;
  }
};

export default errorMsg;

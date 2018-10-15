import { createSelector } from 'reselect';
import _ from 'lodash';

const getTicketFieldsResponse = (state) => state.submitTicket.ticketFields;

export const getFormState = (state) => state.submitTicket.formState;
export const getReadOnlyState = (state) => state.submitTicket.readOnlyState;
export const getLoading = (state) => state.submitTicket.loading;
export const getTicketForms = (state) => state.submitTicket.ticketForms;
export const getTicketFormsAvailable = (state) => getTicketForms(state).length > 0;
export const getTicketFieldsAvailable = (state) => getTicketFieldsResponse(state).length > 0;
export const getActiveTicketForm = (state) => state.submitTicket.activeForm;
export const getErrorMsg = (state) => state.submitTicket.errorMsg;
export const getShowNotification = (state) => state.submitTicket.notification.show;

export const getTicketFields = createSelector(
  [getTicketFieldsResponse],
  (ticketFields) => {
    return _.keyBy(ticketFields, (object) => object.id);
  }
);

export const getActiveTicketFormFields = createSelector(
  [getTicketFields, getActiveTicketForm],
  (ticketFields, form) => {
    const findTicketField = (id) => _.get(ticketFields, id);

    return (_.has(form, 'ticket_field_ids'))
      ? _.compact(_.map(form.ticket_field_ids, findTicketField))
      : [];
  }
);

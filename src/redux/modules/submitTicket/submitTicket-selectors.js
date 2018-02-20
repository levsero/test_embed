export const getFormState = (state) => state.submitTicket.formState;
export const getLoading = (state) => state.submitTicket.loading;
export const getTicketForms = (state) => state.submitTicket.ticketForms;
export const getTicketFormsAvailable = (state) => getTicketForms(state).length > 0;
export const getTicketFields = (state) => state.submitTicket.ticketFields;
export const getTicketFieldsAvailable = (state) => getTicketFields(state).length > 0;
export const getActiveTicketForm = (state) => state.submitTicket.activeForm;

import { FORM_ON_CHANGE } from './submitTicket-action-types';

export function handleFormChange(state) {
  return {
    type: FORM_ON_CHANGE,
    payload: state
  };
}

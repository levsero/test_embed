import _ from 'lodash';
import { FORM_ON_CHANGE,
         TICKET_FORMS_REQUEST_SENT,
         TICKET_FORMS_REQUEST_SUCCESS,
         TICKET_FORMS_REQUEST_FAILURE,
         TICKET_FIELDS_REQUEST_SENT,
         TICKET_FIELDS_REQUEST_SUCCESS,
         TICKET_FIELDS_REQUEST_FAILURE } from './submitTicket-action-types';
import { http } from 'service/transport';

export function handleFormChange(state) {
  return {
    type: FORM_ON_CHANGE,
    payload: state
  };
}

export function getTicketForms(ticketForms, locale) {
  return (dispatch) => {
    const ticketFormIds = _.toString(ticketForms);
    const path = `/api/v2/ticket_forms/show_many.json?ids=${ticketFormIds}&include=ticket_fields`;
    const httpData = {
      method: 'get',
      path,
      timeout: 20000,
      locale,
      callbacks: {
        done(res) {
          dispatch({
            type: TICKET_FORMS_REQUEST_SUCCESS,
            payload: JSON.parse(res.text)
          });
        },
        fail() {
          dispatch({
            type: TICKET_FORMS_REQUEST_FAILURE
          });
        }
      }
    };

    http.get(httpData, false);
    dispatch({
      type: TICKET_FORMS_REQUEST_SENT
    });
  };
}

export function getTicketFields(customFields, locale) {
  return (dispatch) => {
    const pathIds = customFields.all ? '' : `field_ids=${_.toString(customFields.ids)}&`;
    const path = `/embeddable/ticket_fields?${pathIds}locale=${locale}`;
    const httpData = {
      method: 'get',
      path,
      timeout: 20000,
      locale,
      callbacks: {
        done(res) {
          dispatch({
            type: TICKET_FIELDS_REQUEST_SUCCESS,
            payload: JSON.parse(res.text)
          });
        },
        fail() {
          dispatch({
            type: TICKET_FIELDS_REQUEST_FAILURE
          });
        }
      }
    };

    http.get(httpData, false);
    dispatch({
      type: TICKET_FIELDS_REQUEST_SENT
    });
  };
}

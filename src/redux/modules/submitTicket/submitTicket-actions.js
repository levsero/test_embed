import _ from 'lodash';
import { FORM_ON_CHANGE,
  TICKET_FORM_UPDATE,
  TICKET_FORMS_REQUEST_SENT,
  TICKET_FORMS_REQUEST_SUCCESS,
  TICKET_FORMS_REQUEST_FAILURE,
  TICKET_SUBMISSION_REQUEST_SENT,
  TICKET_SUBMISSION_REQUEST_SUCCESS,
  TICKET_SUBMISSION_REQUEST_FAILURE,
  TICKET_FIELDS_REQUEST_SENT,
  TICKET_FIELDS_REQUEST_SUCCESS,
  TICKET_FIELDS_REQUEST_FAILURE } from './submitTicket-action-types';
import { getFormState,
  getActiveTicketForm,
  getTicketFields as getTicketFieldsState,
  getTicketFormsAvailable } from 'src/redux/modules/submitTicket/submitTicket-selectors';
import { http } from 'service/transport';
import { formatRequestData } from './helpers/formatter';
import { i18n } from 'service/i18n';

export function handleFormChange(state) {
  return {
    type: FORM_ON_CHANGE,
    payload: state
  };
}

export function getTicketForms(ticketForms, locale) {
  return (dispatch) => {
    const ticketFormIds = _.toString(ticketForms);
    const path = `/api/v2/ticket_forms/show_many.json?ids=${ticketFormIds}&include=ticket_fields&locale=${locale}`;
    const httpData = {
      method: 'get',
      path,
      timeout: 20000,
      locale,
      callbacks: {
        done(res) {
          const forms = JSON.parse(res.text);

          dispatch({
            type: TICKET_FORMS_REQUEST_SUCCESS,
            payload: forms
          });

          if (forms.ticket_forms.length === 1) {
            dispatch({
              type: TICKET_FORM_UPDATE,
              payload: forms.ticket_forms[0]
            });
          }
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

export function handleTicketFormClick(form) {
  return {
    type: TICKET_FORM_UPDATE,
    payload: form
  };
}

export function handleTicketSubmission(attachments, done, fail) {
  return (dispatch, getState) => {
    const state = getState();
    const formState = getFormState(state);
    const ticketFormsAvailable = getTicketFormsAvailable(state);
    const ticketFields = getTicketFieldsState(state);
    const activeTicketForm = getActiveTicketForm(state);
    const params = formatRequestData(
      state, formState, ticketFormsAvailable, ticketFields, activeTicketForm, attachments);

    const payload = {
      method: 'post',
      path: '/api/v2/requests',
      params: params,
      callbacks: {
        done(res) {
          dispatch({
            type: TICKET_SUBMISSION_REQUEST_SUCCESS,
            payload: JSON.parse(res.text)
          });
          done(res);
        },
        fail(err) {
          dispatch({
            type: TICKET_SUBMISSION_REQUEST_FAILURE,
            payload: (err.timeout)
              ? i18n.t('embeddable_framework.submitTicket.notify.message.timeout')
              : i18n.t('embeddable_framework.submitTicket.notify.message.error')
          });
          fail(err);
        }
      }
    };

    http.send(payload);
    dispatch({
      type: TICKET_SUBMISSION_REQUEST_SENT
    });
  };
}

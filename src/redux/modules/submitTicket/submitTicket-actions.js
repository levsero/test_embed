import {
  FORM_ON_CHANGE,
  TICKET_FORM_UPDATE,
  TICKET_SUBMISSION_REQUEST_SENT,
  TICKET_SUBMISSION_REQUEST_SUCCESS,
  TICKET_SUBMISSION_REQUEST_FAILURE
} from './submitTicket-action-types'
import {
  getFormState,
  getActiveTicketForm,
  getTicketFields as getTicketFieldsState,
  getTicketFormsAvailable
} from 'src/redux/modules/submitTicket/submitTicket-selectors'
import { http } from 'service/transport'
import { formatRequestData } from './helpers/formatter'
import { i18n } from 'service/i18n'
import withRateLimiting from 'utility/rateLimiting'

export function handleFormChange(state) {
  return {
    type: FORM_ON_CHANGE,
    payload: state
  }
}

export function handleTicketFormClick(form) {
  return {
    type: TICKET_FORM_UPDATE,
    payload: form
  }
}

export function handleTicketSubmission(attachments, done, fail) {
  return (dispatch, getState) => {
    const state = getState()
    const formState = getFormState(state)
    const ticketFormsAvailable = getTicketFormsAvailable(state)
    const ticketFields = getTicketFieldsState(state)
    const activeTicketForm = getActiveTicketForm(state)
    const params = formatRequestData(
      state,
      formState,
      ticketFormsAvailable,
      ticketFields,
      activeTicketForm,
      attachments
    )

    const payload = {
      method: 'post',
      path: '/api/v2/requests',
      params: params,
      callbacks: {
        done(res) {
          dispatch({
            type: TICKET_SUBMISSION_REQUEST_SUCCESS,
            payload: JSON.parse(res.text)
          })
          done(res)
        },
        fail(err) {
          dispatch({
            type: TICKET_SUBMISSION_REQUEST_FAILURE,
            payload: err.timeout
              ? i18n.t('embeddable_framework.submitTicket.notify.message.timeout')
              : i18n.t('embeddable_framework.submitTicket.notify.message.error')
          })
          fail(err)
        }
      }
    }

    dispatch({
      type: TICKET_SUBMISSION_REQUEST_SENT
    })

    withRateLimiting(http.send, payload, 'TICKET_SUBMISSION_REQUEST', () => {
      dispatch({
        type: TICKET_SUBMISSION_REQUEST_FAILURE,
        payload: i18n.t('embeddable_framework.common.error.form_submission_disabled')
      })
      fail()
    })
  }
}

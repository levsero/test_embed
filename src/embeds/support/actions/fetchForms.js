import _ from 'lodash'
import {
  TICKET_FIELDS_REQUEST_FAILURE,
  TICKET_FIELDS_REQUEST_SENT,
  TICKET_FIELDS_REQUEST_SUCCESS,
  TICKET_FORM_UPDATE,
  TICKET_FORMS_REQUEST_FAILURE,
  TICKET_FORMS_REQUEST_SENT,
  TICKET_FORMS_REQUEST_SUCCESS
} from './action-types'
import { http } from 'service/transport'
import {
  getCustomFieldIds,
  getCustomFieldsAvailable,
  getTicketFormIds
} from 'src/redux/modules/base/base-selectors'
import { getForm, getHasFetchedTicketForms } from 'embeds/support/selectors'

export function fetchTicketForms(ticketFormIds = [], locale) {
  return async (dispatch, getState) => {
    const state = getState()
    const ticketFormIdsToLoad = ticketFormIds.filter(id => {
      const form = getForm(getState(), id)

      if (!form) {
        return true
      }

      return form.locale !== locale
    })

    if (ticketFormIdsToLoad.length === 0) {
      if (getCustomFieldsAvailable(state)) {
        const customFields = getCustomFieldIds(state)
        dispatch(getTicketFields(customFields, locale))
      }
      return
    }

    // This key is used to identify each API call, if the same forms are requested for the same locale, this key
    // will be the same for those two requests
    const fetchKey = `${locale}/${ticketFormIdsToLoad.sort().join()}`

    if (getHasFetchedTicketForms(getState(), fetchKey)) {
      return
    }

    dispatch({
      type: TICKET_FORMS_REQUEST_SENT,
      payload: {
        fetchKey,
        formIds: ticketFormIdsToLoad
      }
    })

    const path = `/api/v2/ticket_forms/show_many.json?ids=${_.toString(
      ticketFormIdsToLoad
    )}&include=ticket_fields&locale=${locale}`

    return new Promise((resolve, reject) => {
      http.get(
        {
          method: 'get',
          path,
          locale,
          timeout: 20000,
          callbacks: {
            done(res) {
              const forms = JSON.parse(res.text)

              if (Array.isArray(forms.ticket_forms)) {
                forms.ticket_forms = forms.ticket_forms.map(form => ({
                  ...form,
                  locale
                }))
              }

              dispatch({
                type: TICKET_FORMS_REQUEST_SUCCESS,
                payload: {
                  ...forms,
                  fetchKey,
                  formIds: ticketFormIdsToLoad
                }
              })

              if (forms.ticket_forms.length === 1) {
                dispatch({
                  type: TICKET_FORM_UPDATE,
                  payload: forms.ticket_forms[0]
                })
              }

              resolve()
            },
            fail() {
              dispatch({
                type: TICKET_FORMS_REQUEST_FAILURE,
                payload: {
                  fetchKey,
                  formIds: ticketFormIdsToLoad
                }
              })

              reject()
            }
          }
        },
        false
      )
    })
  }
}

export function getTicketFields(customFields, locale) {
  return dispatch => {
    const pathIds = customFields.all ? '' : `field_ids=${_.toString(customFields.ids)}&`
    const path = `/embeddable/ticket_fields?${pathIds}locale=${locale}`
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
          })
        },
        fail() {
          dispatch({
            type: TICKET_FIELDS_REQUEST_FAILURE
          })
        }
      }
    }

    http.get(httpData, false)
    dispatch({
      type: TICKET_FIELDS_REQUEST_SENT
    })
  }
}

export function updateFormsForLocaleChange(locale) {
  return (dispatch, getState) => {
    const state = getState()

    const ticketFormIds = getTicketFormIds(state)
    if (ticketFormIds.length > 0) {
      dispatch(fetchTicketForms(ticketFormIds, locale))
    } else if (getCustomFieldsAvailable(state)) {
      const customFields = getCustomFieldIds(state)
      dispatch(getTicketFields(customFields, locale))
    }
  }
}

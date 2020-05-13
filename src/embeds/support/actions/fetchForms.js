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
import { getCustomFieldIds, getCustomFieldsAvailable } from 'src/redux/modules/base/base-selectors'
import { getForm, getHasFetchedTicketForms } from 'embeds/support/selectors'

export function fetchTicketForms(ticketFormIds = [], locale) {
  return async (dispatch, getState) => {
    const ticketFormIdsToLoad = ticketFormIds.filter(id => {
      const form = getForm(getState(), id)

      if (!form) {
        return true
      }

      return form.locale !== locale
    })

    if (ticketFormIdsToLoad.length === 0) {
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

let mostRecentCall = null
export const resetCacheForTests = () => {
  mostRecentCall = null
}
export function getTicketFields(locale) {
  return async (dispatch, getState) => {
    const state = getState()
    if (!getCustomFieldsAvailable(state)) return
    const customFields = getCustomFieldIds(state)

    const pathIds = customFields.all ? '' : `field_ids=${_.toString(customFields.ids)}&`
    const path = `/embeddable/ticket_fields?${pathIds}locale=${locale}`

    if (mostRecentCall === path) return
    mostRecentCall = path
    return new Promise((resolve, reject) => {
      http.get(
        {
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
              resolve()
            },
            fail() {
              dispatch({
                type: TICKET_FIELDS_REQUEST_FAILURE
              })
              reject()
            }
          }
        },
        false
      )
      dispatch({
        type: TICKET_FIELDS_REQUEST_SENT
      })
    })
  }
}

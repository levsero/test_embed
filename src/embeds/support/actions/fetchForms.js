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
import { ALL_FORMS_REQUESTED } from 'src/redux/modules/settings/settings-action-types'
import { http } from 'service/transport'
import { getCustomFieldIds } from 'src/redux/modules/base/base-selectors'
import { getForm, getHasFetchedTicketForms } from 'embeds/support/selectors'
import errorTracker from 'src/framework/services/errorTracker'

export function fetchTicketForms(ticketForms = {}, locale) {
  return async (dispatch, getState) => {
    const ticketFormIdsToLoad = ticketForms.ids.filter(id => {
      const form = getForm(getState(), id)

      if (!form) {
        return true
      }

      return form.locale !== locale
    })

    if (ticketFormIdsToLoad.length === 0 && !ticketForms.requestAll) {
      return
    }

    // This key is used to identify each API call, if the same forms are requested for the same locale, this key
    // will be the same for those two requests
    const keyIds = !ticketForms.requestAll ? ticketFormIdsToLoad.sort().join() : 'all'
    const fetchKey = `${locale}/${keyIds}`

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

    const idParams = !ticketForms.requestAll ? `ids=${_.toString(ticketFormIdsToLoad)}&` : ''
    const path = [
      '/api/v2/ticket_forms/show_many.json',
      `?${idParams}include=ticket_fields`,
      `&locale=${locale}`,
      '&associated_to_brand=true',
      '&end_user_visible=true',
      '&active=true'
    ].join('')

    return http
      .get(
        {
          path,
          locale
        },
        false
      )
      .then(res => {
        const forms = res.body

        if (Array.isArray(forms.ticket_forms)) {
          forms.ticket_forms = forms.ticket_forms.map(form => ({
            ...form,
            locale
          }))
        }

        dispatch({
          type: ALL_FORMS_REQUESTED,
          payload: keyIds === 'all'
        })

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
      })
      .catch(err => {
        dispatch({
          type: TICKET_FORMS_REQUEST_FAILURE,
          payload: {
            fetchKey,
            formIds: ticketFormIdsToLoad
          }
        })

        errorTracker.error('ticket form request failure', err.message)
      })
  }
}

export function getTicketFields(locale) {
  return async (dispatch, getState) => {
    const customFields = getCustomFieldIds(getState())
    const pathIds = customFields.all ? '' : `field_ids=${_.toString(customFields.ids)}&`
    const path = `/embeddable/ticket_fields?${pathIds}locale=${locale}`

    dispatch({
      type: TICKET_FIELDS_REQUEST_SENT
    })

    return http
      .get(
        {
          path,
          locale
        },
        false
      )
      .then(res => {
        dispatch({
          type: TICKET_FIELDS_REQUEST_SUCCESS,
          payload: res.body
        })
      })
      .catch(err => {
        dispatch({
          type: TICKET_FIELDS_REQUEST_FAILURE
        })

        errorTracker.error('ticket fields request failure', err.message)
      })
  }
}

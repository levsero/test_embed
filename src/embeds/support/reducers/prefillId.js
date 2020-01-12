import _ from 'lodash'
import { LOCALE_SET, PREFILL_RECEIVED } from 'src/redux/modules/base/base-action-types'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'

// The purpose of this reducer is to have some value change whenever the prefill apis have been updated.
// The way our prefill APIs work, is when the user calls prefill or update settings, the form is immediately updated
// with the values they entered.
// If the user calls the api with the same values twice though, we still want to maintain the behaviour of the forms
// immediately showing the values they submitted into the api.
// Since the value hasn't changed, we need a simple way to track when the prefill has changed, this id
// provides that functionality.
const prefillId = (state = 0, action) => {
  switch (action.type) {
    case PREFILL_RECEIVED:
    case LOCALE_SET:
      return state + 1
    case UPDATE_SETTINGS:
      const hasTicketFormValues =
        _.get(action.payload, 'webWidget.contactForm.ticketForms', []).length > 0
      const hasFieldValues = _.get(action.payload, 'webWidget.contactForm.fields', []).length > 0

      if (!hasTicketFormValues && !hasFieldValues) {
        return state
      }

      return state + 1
    default:
      return state
  }
}

export default prefillId

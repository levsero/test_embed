import _ from 'lodash'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import normaliseFieldPrefillValues from 'embeds/support/utils/normaliseFieldPrefillValues'

const prefillSpecificFormValues = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS:
      const forms = _.get(action.payload, 'webWidget.contactForm.ticketForms', [])

      const updatedValues = {}

      forms.forEach(form => {
        updatedValues[form.id] = normaliseFieldPrefillValues(form.fields)
      })

      return _.merge({}, state, updatedValues)
    default:
      return state
  }
}

export default prefillSpecificFormValues

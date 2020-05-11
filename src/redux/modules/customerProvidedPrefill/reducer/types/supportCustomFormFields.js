import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import _ from 'lodash'
import normaliseFieldPrefillValues from 'embeds/support/utils/normaliseFieldPrefillValues'

const initialState = {
  timestamp: 0,
  values: {}
}

const supportCustomFormFields = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS:
      const forms = _.get(action.payload, 'webWidget.contactForm.ticketForms', [])

      const updatedValues = {}

      forms.forEach(form => {
        updatedValues[form.id] = normaliseFieldPrefillValues(form.fields)
      })

      if (Object.keys(updatedValues).length === 0) {
        return state
      }

      return {
        timestamp: Date.now(),
        values: _.merge({}, state.values || {}, updatedValues)
      }
    default:
      return state
  }
}

export default supportCustomFormFields

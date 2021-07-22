import normaliseDescriptionOverrideValues from 'embeds/support/utils/normaliseDescriptionOverrideValues'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'

const initialState = {}

const fieldDescriptionOverrides = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS: {
      const ticketForms = action.payload?.webWidget?.contactForm?.ticketForms

      if (Array.isArray(ticketForms)) {
        return ticketForms.reduce((values, form) => {
          if (form?.id && form?.fields) {
            const normalisedValues = normaliseDescriptionOverrideValues(form.fields)

            if (Object.keys(normalisedValues).length > 0) {
              values[form.id] = normalisedValues
            }
          }

          return values
        }, {})
      }

      return state
    }
    default:
      return state
  }
}

export default fieldDescriptionOverrides

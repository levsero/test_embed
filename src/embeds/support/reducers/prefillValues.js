import _ from 'lodash'
import { PREFILL_RECEIVED } from 'src/redux/modules/base/base-action-types'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import normaliseFieldPrefillValues from 'embeds/support/utils/normaliseFieldPrefillValues'

const prefillValues = (state = {}, action) => {
  switch (action.type) {
    case PREFILL_RECEIVED:
      return {
        ...state,
        '*': {
          ...(state['*'] || {}),
          ...action.payload.prefillValues
        }
      }
    case UPDATE_SETTINGS:
      const fields = _.get(action.payload, 'webWidget.contactForm.fields', [])

      if (fields.length === 0) {
        return state
      }

      return _.merge({}, state, normaliseFieldPrefillValues(fields))
    default:
      return state
  }
}

export default prefillValues

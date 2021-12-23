import normaliseFieldPrefillValues from 'classicSrc/embeds/support/utils/normaliseFieldPrefillValues'
import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import _ from 'lodash'

const initialState = {
  timestamp: 0,
  values: {},
}

const supportFields = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS:
      const fields = _.get(action.payload, 'webWidget.contactForm.fields', [])

      if (fields.length === 0) {
        return state
      }

      return {
        timestamp: Date.now(),
        values: _.merge({}, state.values, normaliseFieldPrefillValues(fields)),
      }
    default:
      return state
  }
}

export default supportFields

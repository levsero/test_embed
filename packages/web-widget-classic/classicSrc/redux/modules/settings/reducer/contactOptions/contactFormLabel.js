import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import _ from 'lodash'

const initialState = null

const contactFormLabel = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return _.get(payload, 'webWidget.contactOptions.contactFormLabel', state)
    default:
      return state
  }
}

export default contactFormLabel

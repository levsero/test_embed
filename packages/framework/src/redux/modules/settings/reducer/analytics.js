import _ from 'lodash'
import { UPDATE_SETTINGS } from '../settings-action-types'

const initialState = true

const tags = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return _.get(payload, 'webWidget.analytics', state)
    default:
      return state
  }
}

export default tags

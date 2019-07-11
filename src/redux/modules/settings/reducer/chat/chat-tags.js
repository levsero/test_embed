import { UPDATE_SETTINGS } from '../../settings-action-types'
import _ from 'lodash'

const initialState = []

const tags = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return _.get(payload, 'webWidget.chat.tags', state)
    default:
      return state
  }
}

export default tags

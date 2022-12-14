import _ from 'lodash'
import { UPDATE_SETTINGS } from '../../settings-action-types'

const initialState = ''

const select = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return _.get(payload, 'webWidget.chat.departments.select', state)
    default:
      return state
  }
}

export default select

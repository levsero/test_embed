import _ from 'lodash'
import { UPDATE_SETTINGS } from '../../settings-action-types'

const initialState = true

const connectOnPageLoad = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return Boolean(_.get(payload, 'webWidget.chat.connectOnPageLoad', state))
    default:
      return state
  }
}

export default connectOnPageLoad

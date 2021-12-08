import _ from 'lodash'
import { UPDATE_SETTINGS } from '../../settings-action-types'

const initialState = {
  greeting: null,
}

const offlineForm = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        greeting: _.get(payload, 'webWidget.chat.offlineForm.greeting', state.greeting),
      }
    default:
      return state
  }
}

export default offlineForm

import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import _ from 'lodash'

const initialState = {
  chatLabelOnline: null,
  chatLabelOffline: null,
}

const chatContactOptions = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        chatLabelOnline: _.get(
          payload,
          'webWidget.contactOptions.chatLabelOnline',
          state.chatLabelOnline
        ),
        chatLabelOffline: _.get(
          payload,
          'webWidget.contactOptions.chatLabelOffline',
          state.chatLabelOffline
        ),
      }
    default:
      return state
  }
}

export default chatContactOptions

import _ from 'lodash'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'

const initialState = true

const emailTranscriptEnabled = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return Boolean(_.get(payload, 'webWidget.chat.menuOptions.emailTranscript', state))
    default:
      return state
  }
}

export default emailTranscriptEnabled

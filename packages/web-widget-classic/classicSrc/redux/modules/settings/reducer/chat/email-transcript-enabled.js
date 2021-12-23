import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import _ from 'lodash'

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

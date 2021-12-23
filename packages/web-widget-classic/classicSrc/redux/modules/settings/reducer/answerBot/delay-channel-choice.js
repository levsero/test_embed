import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import _ from 'lodash'

const initialState = false

const delayChannelChoice = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return _.get(payload, 'webWidget.answerBot.contactOnlyAfterQuery', state)
    default:
      return state
  }
}

export default delayChannelChoice

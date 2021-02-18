import { UPDATE_SETTINGS } from '../../settings-action-types'

import _ from 'lodash'

const initialState = {
  url: '',
  name: {},
}

const avatar = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        url: _.get(payload, 'webWidget.answerBot.avatar.url', state.url),
        name: _.get(payload, 'webWidget.answerBot.avatar.name', state.name),
      }
    default:
      return state
  }
}

export default avatar

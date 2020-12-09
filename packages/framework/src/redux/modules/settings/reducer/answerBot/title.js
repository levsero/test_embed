import { UPDATE_SETTINGS } from '../../settings-action-types'

import _ from 'lodash'

const initialState = {}

const title = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        ...state,
        ..._.get(payload, 'webWidget.answerBot.title', state)
      }
    default:
      return state
  }
}

export default title

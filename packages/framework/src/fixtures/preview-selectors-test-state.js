import _ from 'lodash'

import { CHAT } from 'src/constants/preview'

const getModifiedState = (inputState = {}) => {
  const defaultState = {
    preview: {
      choice: CHAT,
      enabled: true,
    },
  }

  return _.merge({}, defaultState, inputState)
}

export default getModifiedState

import { CHAT } from 'classicSrc/constants/preview'
import _ from 'lodash'

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

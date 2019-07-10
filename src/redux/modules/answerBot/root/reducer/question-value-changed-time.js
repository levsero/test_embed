import { QUESTION_VALUE_CHANGED } from '../../conversation/action-types'

const initialState = null

const currentMessage = (state = initialState, { type }) => {
  switch (type) {
    case QUESTION_VALUE_CHANGED:
      return Date.now()
    default:
      return state
  }
}

export default currentMessage

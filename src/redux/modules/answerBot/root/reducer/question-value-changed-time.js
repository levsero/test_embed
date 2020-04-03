import { QUESTION_VALUE_CHANGED } from 'src/embeds/answerBot/actions/conversation/action-types'

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

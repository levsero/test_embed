import { QUESTION_VALUE_CHANGED } from 'classicSrc/embeds/answerBot/actions/conversation/action-types'

const initialState = ''

const currentMessage = (state = initialState, action) => {
  switch (action.type) {
    case QUESTION_VALUE_CHANGED:
      return action.payload
    default:
      return state
  }
}

export default currentMessage

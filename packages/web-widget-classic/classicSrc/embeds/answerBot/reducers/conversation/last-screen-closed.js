import { CONVERSATION_SCREEN_CLOSED } from 'classicSrc/embeds/answerBot/actions/conversation/action-types'

const initialState = 0

const lastScreenClosed = (state = initialState, action) => {
  switch (action.type) {
    case CONVERSATION_SCREEN_CLOSED:
      return action.payload
    default:
      return state
  }
}

export default lastScreenClosed

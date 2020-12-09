import { CONVERSATION_SCROLL_CHANGED } from 'src/embeds/answerBot/actions/conversation/action-types'

const initialState = 0

const lastScroll = (state = initialState, action) => {
  switch (action.type) {
    case CONVERSATION_SCROLL_CHANGED:
      return action.payload
    default:
      return state
  }
}

export default lastScroll

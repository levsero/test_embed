import { CONTEXTUAL_SEARCH_FINISHED } from 'src/embeds/answerBot/actions/root/action-types'

const initialState = false

const contextualSearchFinished = (state = initialState, action) => {
  switch (action.type) {
    case CONTEXTUAL_SEARCH_FINISHED:
      return true
    default:
      return state
  }
}

export default contextualSearchFinished

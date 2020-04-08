import { SCREEN_CHANGED } from 'src/embeds/answerBot/actions/root/action-types'

const initialState = 'conversation'

const currentScreen = (state = initialState, action) => {
  switch (action.type) {
    case SCREEN_CHANGED:
      return action.payload
    default:
      return state
  }
}

export default currentScreen

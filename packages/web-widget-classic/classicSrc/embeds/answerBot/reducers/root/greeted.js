import { BOT_GREETED } from 'classicSrc/embeds/answerBot/actions/root/action-types'

const initialState = false

const greeted = (state = initialState, action) => {
  switch (action.type) {
    case BOT_GREETED:
      return action.payload
    default:
      return state
  }
}

export default greeted

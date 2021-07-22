import { INCREMENT_CALL_TIMER, CALL_STARTED } from 'src/embeds/talk/actions/action-types'

const timeInCall = (state = 0, action = {}) => {
  const { type } = action

  switch (type) {
    case INCREMENT_CALL_TIMER:
      return state + 1
    case CALL_STARTED:
      return 0
    default:
      return state
  }
}

export default timeInCall

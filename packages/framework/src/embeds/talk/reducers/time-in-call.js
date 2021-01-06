import { INCREMENT_CALL_TIMER, START_CALL } from 'embeds/talk/actions/action-types'

const timeInCall = (state = 0, action = {}) => {
  const { type } = action

  switch (type) {
    case INCREMENT_CALL_TIMER:
      return state + 1
    case START_CALL:
      return 0
    default:
      return state
  }
}

export default timeInCall

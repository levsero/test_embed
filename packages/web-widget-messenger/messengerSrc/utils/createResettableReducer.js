import { cookiesDisabled } from 'messengerSrc/store/cookies'
import { userLoggedIn, userLoggedOut } from '../store/actions'

const resettableActions = {
  [cookiesDisabled.pending]: true,
  [userLoggedOut]: true,
  [userLoggedIn]: true,
}

const createResettableReducer = (reducer, options) => (state, action) => {
  if (resettableActions[action.type] && !options?.excludeActions?.includes(action.type)) {
    return reducer(undefined, action)
  }

  return reducer(state, action)
}

export default createResettableReducer

export { resettableActions }

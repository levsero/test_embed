import { cookiesDisabled } from 'messengerSrc/store/cookies'
import { userLoggedOut } from '../store/actions'

const resettableActions = {
  [cookiesDisabled.pending]: true,
  [userLoggedOut]: true,
}

const createResettableReducer = (reducer) => (state, action) => {
  if (resettableActions[action.type]) {
    return reducer(undefined, action)
  }

  return reducer(state, action)
}

export default createResettableReducer

export { resettableActions }

import { cookiesDisabled } from 'src/apps/messenger/store/cookies'

const resettableActions = {
  [cookiesDisabled.pending]: true
}

const createResettableReducer = reducer => (state, action) => {
  if (resettableActions[action.type]) {
    return reducer(undefined, action)
  }

  return reducer(state, action)
}

export default createResettableReducer

export { resettableActions }

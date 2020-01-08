import { CLEARED_FORM_STATES, SET_FORM_STATE } from 'src/embeds/support/actions/action-types'
import { CLEARED_FORM_STATE } from '../actions/action-types'

const initialState = {}

const formStates = (state = initialState, action = {}) => {
  const { type, payload } = action

  switch (type) {
    case SET_FORM_STATE:
      return {
        ...state,
        [payload.name]: payload.newFormState
      }
    case CLEARED_FORM_STATES:
      return initialState
    case CLEARED_FORM_STATE: {
      const newState = { ...state }
      delete newState[payload.name]
      return newState
    }

    default:
      return state
  }
}

export default formStates

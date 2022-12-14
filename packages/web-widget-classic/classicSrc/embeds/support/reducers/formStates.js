import {
  CLEARED_FORM_STATES,
  SET_FORM_STATE,
  TICKET_SUBMISSION_REQUEST_SUCCESS,
  CLEARED_FORM_STATE,
} from 'classicSrc/embeds/support/actions/action-types'
import { API_CLEAR_FORM, API_RESET_WIDGET } from 'classicSrc/redux/modules/base/base-action-types'

const initialState = {}

const formStates = (state = initialState, action = {}) => {
  const { type, payload } = action

  switch (type) {
    case SET_FORM_STATE:
      return {
        ...state,
        [payload.name]: payload.newFormState,
      }
    case CLEARED_FORM_STATES:
      return initialState
    case CLEARED_FORM_STATE:
    case TICKET_SUBMISSION_REQUEST_SUCCESS: {
      const newState = { ...state }
      delete newState[payload.name]
      return newState
    }

    case API_RESET_WIDGET:
    case API_CLEAR_FORM:
      return initialState
    default:
      return state
  }
}

export default formStates

import { ALL_FORMS_CLEARED, SET_FORM_STATE, CLEARED_FORM_STATE } from '../action-types'
import { API_CLEAR_FORM, API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'

const initialState = {}

const formValues = (state = initialState, action = {}) => {
  const { type, payload } = action

  switch (type) {
    case SET_FORM_STATE:
      return {
        ...state,
        [payload.formId]: payload.newFormState
      }
    case ALL_FORMS_CLEARED:
      return initialState
    case CLEARED_FORM_STATE:
      const newState = { ...state }
      delete newState[payload.formId]
      return newState
    case API_RESET_WIDGET:
    case API_CLEAR_FORM:
      return initialState
    default:
      return state
  }
}

export default formValues

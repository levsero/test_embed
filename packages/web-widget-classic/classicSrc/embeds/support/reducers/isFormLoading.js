import {
  TICKET_FORMS_REQUEST_SENT,
  TICKET_FORMS_REQUEST_SUCCESS,
  TICKET_FORMS_REQUEST_FAILURE,
} from 'classicSrc/embeds/support/actions/action-types'

const initialState = {}

const isFormLoading = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case TICKET_FORMS_REQUEST_SENT: {
      const newState = { ...state }
      action.payload.formIds.forEach((formId) => {
        newState[formId] = action.payload.fetchKey
      })
      return newState
    }
    case TICKET_FORMS_REQUEST_SUCCESS:
    case TICKET_FORMS_REQUEST_FAILURE: {
      const newState = { ...state }
      action.payload.formIds.forEach((formId) => {
        if (newState[formId] === action.payload.fetchKey) {
          newState[formId] = false
        }
      })
      return newState
    }
    default:
      return state
  }
}

export default isFormLoading

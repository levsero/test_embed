import {
  TICKET_FORMS_REQUEST_SENT,
  TICKET_FORMS_REQUEST_SUCCESS,
  TICKET_FORMS_REQUEST_FAILURE,
  TICKET_FIELDS_REQUEST_SENT,
  TICKET_FIELDS_REQUEST_SUCCESS,
  TICKET_FIELDS_REQUEST_FAILURE
} from 'src/embeds/support/actions/action-types'

const initialState = false

const isLoading = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case TICKET_FIELDS_REQUEST_SENT:
    case TICKET_FORMS_REQUEST_SENT:
      return true
    case TICKET_FORMS_REQUEST_SUCCESS:
    case TICKET_FIELDS_REQUEST_SUCCESS:
    case TICKET_FORMS_REQUEST_FAILURE:
    case TICKET_FIELDS_REQUEST_FAILURE:
      return false
    default:
      return state
  }
}

export default isLoading

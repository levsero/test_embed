import {
  TICKET_FIELDS_REQUEST_SENT,
  TICKET_FIELDS_REQUEST_SUCCESS,
  TICKET_FIELDS_REQUEST_FAILURE,
} from 'classicSrc/embeds/support/actions/action-types'

const initialState = false

const isTicketFieldsLoading = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case TICKET_FIELDS_REQUEST_SENT:
      return true
    case TICKET_FIELDS_REQUEST_SUCCESS:
    case TICKET_FIELDS_REQUEST_FAILURE:
      return false
    default:
      return state
  }
}

export default isTicketFieldsLoading

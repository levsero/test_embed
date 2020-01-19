import { TICKET_FIELDS_REQUEST_SUCCESS } from 'src/redux/modules/submitTicket/submitTicket-action-types'

const initialState = []

const contactFormFields = (state = initialState, action) => {
  switch (action.type) {
    case TICKET_FIELDS_REQUEST_SUCCESS:
      return action.payload
    default:
      return state
  }
}

export default contactFormFields

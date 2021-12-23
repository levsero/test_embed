import {
  TICKET_FORMS_REQUEST_FAILURE,
  TICKET_FORMS_REQUEST_SENT,
  TICKET_FORMS_REQUEST_SUCCESS,
} from 'classicSrc/embeds/support/actions/action-types'

const initialState = {
  isLoading: false,
  fetchKey: null,
}

const ticketFormsRequest = (state = initialState, action) => {
  switch (action.type) {
    case TICKET_FORMS_REQUEST_SENT:
      return {
        isLoading: true,
        fetchKey: action.payload.fetchKey,
      }
    case TICKET_FORMS_REQUEST_SUCCESS:
    case TICKET_FORMS_REQUEST_FAILURE:
      if (action.payload.fetchKey !== state.fetchKey) {
        return state
      }
      return {
        isLoading: false,
        fetchKey: action.payload.fetchKey,
      }
    default:
      return state
  }
}

export default ticketFormsRequest

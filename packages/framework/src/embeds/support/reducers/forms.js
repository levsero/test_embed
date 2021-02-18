import { TICKET_FORMS_REQUEST_SUCCESS } from 'src/embeds/support/actions/action-types'

const initialState = {}

const forms = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case TICKET_FORMS_REQUEST_SUCCESS:
      return payload.ticket_forms.reduce(
        (prev, next) => ({
          ...prev,
          [next.id]: next,
        }),
        state
      )
    default:
      return state
  }
}

export default forms

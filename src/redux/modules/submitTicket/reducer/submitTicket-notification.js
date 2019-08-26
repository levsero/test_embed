import { TICKET_SUBMISSION_REQUEST_SUCCESS } from '../submitTicket-action-types'
import { UPDATE_WIDGET_SHOWN, UPDATE_ACTIVE_EMBED } from '../../base/base-action-types'

const initialState = {
  show: false
}

const notification = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case TICKET_SUBMISSION_REQUEST_SUCCESS:
      return { show: true }
    case UPDATE_ACTIVE_EMBED:
    case UPDATE_WIDGET_SHOWN:
      return { show: false }
    default:
      return state
  }
}

export default notification

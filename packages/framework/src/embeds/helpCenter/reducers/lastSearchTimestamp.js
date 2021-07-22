import {
  SEARCH_REQUEST_SENT,
  CONTEXTUAL_SEARCH_REQUEST_SENT,
} from 'src/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'

const initialState = -1

const lastSearchTimestamp = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SEARCH_REQUEST_SENT:
    case CONTEXTUAL_SEARCH_REQUEST_SENT:
      return payload.timestamp
    case API_RESET_WIDGET:
      return initialState
    default:
      return state
  }
}

export default lastSearchTimestamp

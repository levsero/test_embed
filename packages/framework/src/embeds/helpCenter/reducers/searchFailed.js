import {
  SEARCH_REQUEST_SENT,
  SEARCH_REQUEST_FAILURE,
} from 'src/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'

const initialState = false

const searchFailed = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case API_RESET_WIDGET:
    case SEARCH_REQUEST_SENT:
      return initialState
    case SEARCH_REQUEST_FAILURE:
      return true
    default:
      return state
  }
}

export default searchFailed

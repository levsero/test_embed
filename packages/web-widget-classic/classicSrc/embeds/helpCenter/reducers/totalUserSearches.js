import {
  SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_FAILURE,
} from 'classicSrc/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'classicSrc/redux/modules/base/base-action-types'

const initialState = 0

const totalUserSearches = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case SEARCH_REQUEST_SUCCESS:
    case SEARCH_REQUEST_FAILURE:
      return state + 1
    case API_RESET_WIDGET:
      return initialState
    default:
      return state
  }
}

export default totalUserSearches

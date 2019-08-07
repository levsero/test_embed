import {
  SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_FAILURE
} from 'embeds/helpCenter/actions/action-types'
import { API_CLEAR_HC_SEARCHES } from '../../base/base-action-types'

const initialState = 0

const totalUserSearches = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case SEARCH_REQUEST_SUCCESS:
    case SEARCH_REQUEST_FAILURE:
      return state + 1
    case API_CLEAR_HC_SEARCHES:
      return initialState
    default:
      return state
  }
}

export default totalUserSearches

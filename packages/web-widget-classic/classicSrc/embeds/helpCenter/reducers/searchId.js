import {
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_SUCCESS,
} from 'classicSrc/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'classicSrc/redux/modules/base/base-action-types'

const initialState = 0

const searchId = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
    case SEARCH_REQUEST_SUCCESS:
      return payload.searchId
    case API_RESET_WIDGET:
      return initialState
    default:
      return state
  }
}

export default searchId

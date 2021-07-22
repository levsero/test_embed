import {
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_SENT,
  CONTEXTUAL_SEARCH_REQUEST_FAILURE,
  SEARCH_REQUEST_SUCCESS,
} from 'src/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'

const initialState = {
  hasSearched: false,
  screen: '',
}

const contextualSearch = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case CONTEXTUAL_SEARCH_REQUEST_SENT:
      return {
        hasSearched: true,
        screen: type,
      }
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
    case CONTEXTUAL_SEARCH_REQUEST_FAILURE:
      return {
        ...state,
        screen: type,
      }
    case API_RESET_WIDGET:
    case SEARCH_REQUEST_SUCCESS:
      return initialState
    default:
      return state
  }
}

export default contextualSearch

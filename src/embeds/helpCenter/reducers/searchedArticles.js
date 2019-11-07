import {
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_FAILURE
} from 'embeds/helpCenter/actions/action-types'
import { API_CLEAR_HC_SEARCHES } from 'src/redux/modules/base/base-action-types'

const initialState = []

const articles = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
    case SEARCH_REQUEST_SUCCESS:
      return payload.articles.map(article => article.id)
    case SEARCH_REQUEST_FAILURE:
    case API_CLEAR_HC_SEARCHES:
      return initialState
    default:
      return state
  }
}

export default articles

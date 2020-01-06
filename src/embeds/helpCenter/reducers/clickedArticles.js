import {
  ARTICLE_VIEWED,
  ARTICLE_CLOSED,
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_SUCCESS
} from 'embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'

const initialState = { current: null, previous: null }

const clickedArticles = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case ARTICLE_VIEWED:
      return { ...state, current: payload.id }
    case ARTICLE_CLOSED:
      return { current: null, previous: state.current }
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
    case SEARCH_REQUEST_SUCCESS:
    case API_RESET_WIDGET:
      return initialState
    default:
      return state
  }
}

export default clickedArticles

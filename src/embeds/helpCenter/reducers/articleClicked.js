import {
  SEARCH_REQUEST_SENT,
  ARTICLE_CLICKED,
  ARTICLE_CLOSED
} from 'embeds/helpCenter/actions/action-types'
import { API_CLEAR_HC_SEARCHES } from 'src/redux/modules/base/base-action-types'

const initialState = false

const articleClicked = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case ARTICLE_CLOSED:
    case SEARCH_REQUEST_SENT:
    case API_CLEAR_HC_SEARCHES:
      return false
    case ARTICLE_CLICKED:
      return true
    default:
      return state
  }
}

export default articleClicked
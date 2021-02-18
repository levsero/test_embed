import {
  GET_ARTICLE_REQUEST_SENT,
  GET_ARTICLE_REQUEST_SUCCESS,
  GET_ARTICLE_REQUEST_FAILURE,
  ARTICLE_VIEWED,
} from 'embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'

const initialState = null

const articleDisplayed = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case API_RESET_WIDGET:
    case GET_ARTICLE_REQUEST_FAILURE:
    case GET_ARTICLE_REQUEST_SENT:
    case ARTICLE_VIEWED:
      return initialState
    case GET_ARTICLE_REQUEST_SUCCESS:
      return payload.id
    default:
      return state
  }
}

export default articleDisplayed

import {
  GET_ARTICLE_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_SUCCESS,
} from 'src/embeds/helpCenter/actions/action-types'

const initialState = {}

const articles = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case CONTEXTUAL_SEARCH_REQUEST_SUCCESS:
    case SEARCH_REQUEST_SUCCESS:
      const articles = payload.articles.reduce((obj, article) => {
        obj[article.id] = article
        return obj
      }, {})
      return {
        ...state,
        ...articles,
      }
    case GET_ARTICLE_REQUEST_SUCCESS:
      return {
        ...state,
        [payload.id]: payload,
      }
    default:
      return state
  }
}

export default articles

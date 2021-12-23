import {
  ARTICLE_SHOWN,
  CONTEXTUAL_ARTICLE_SHOWN,
} from 'classicSrc/embeds/answerBot/actions/root/action-types'

const initialState = null

const currentContextualArticle = (state = initialState, action) => {
  switch (action.type) {
    case ARTICLE_SHOWN:
      return null
    case CONTEXTUAL_ARTICLE_SHOWN:
      return {
        articleID: action.payload.articleID,
      }
    default:
      return state
  }
}

export default currentContextualArticle

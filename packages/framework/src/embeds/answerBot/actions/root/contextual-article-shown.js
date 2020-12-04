import { CONTEXTUAL_ARTICLE_SHOWN } from './action-types'

export const contextualArticleShown = articleID => {
  return {
    type: CONTEXTUAL_ARTICLE_SHOWN,
    payload: {
      articleID
    }
  }
}

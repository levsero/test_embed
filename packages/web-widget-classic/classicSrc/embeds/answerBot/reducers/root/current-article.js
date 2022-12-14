import { ARTICLE_SHOWN } from 'classicSrc/embeds/answerBot/actions/root/action-types'

const initialState = null

const currentArticle = (state = initialState, action) => {
  switch (action.type) {
    case ARTICLE_SHOWN:
      return {
        articleID: action.payload.articleID,
        sessionID: action.payload.sessionID,
      }
    default:
      return state
  }
}

export default currentArticle

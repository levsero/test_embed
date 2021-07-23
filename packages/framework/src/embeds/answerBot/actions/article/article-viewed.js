import { ANSWER_BOT_ORIGINAL_ARTICLE_CLICKED } from 'src/embeds/answerBot/actions/article/action-types'
import { getSessionByID } from 'src/embeds/answerBot/selectors/sessions'
import { settings } from 'src/service/settings'
import { http } from 'src/service/transport'
import {
  ARTICLE_VIEWED_PENDING,
  ARTICLE_VIEWED_FULFILLED,
  ARTICLE_VIEWED_REJECTED,
} from './action-types'

function articleViewedPending(sessionID, articleID) {
  return {
    type: ARTICLE_VIEWED_PENDING,
    payload: {
      sessionID,
      articleID,
    },
  }
}

function articleViewedFulfilled(sessionID, articleID) {
  return {
    type: ARTICLE_VIEWED_FULFILLED,
    payload: {
      sessionID,
      articleID,
    },
  }
}

function articleViewedRejected(error, sessionID, articleID) {
  return {
    type: ARTICLE_VIEWED_REJECTED,
    payload: {
      error,
      sessionID,
      articleID,
    },
  }
}

export const articleViewed = (sessionID, articleID) => {
  return (dispatch, getState) => {
    const state = getState()
    const session = getSessionByID(state, sessionID)
    const deflectionID = session.deflection.id
    const interactionToken = session.interactionToken

    dispatch(articleViewedPending(sessionID, articleID))

    const callbacks = {
      done: () => {
        dispatch(articleViewedFulfilled(sessionID, articleID))
      },
      fail: (err) => {
        dispatch(articleViewedRejected(err, sessionID, articleID))
      },
    }

    const params = {
      deflection_id: deflectionID,
      interaction_access_token: interactionToken,
      article_id: articleID,
      resolution_channel_id: settings.get('viaIdAnswerBot'),
    }

    http.send({
      callbacks,
      method: 'post',
      path: '/api/v2/answer_bot/viewed',
      params,
    })
  }
}

export const originalArticleClicked = (articleId) => ({
  type: ANSWER_BOT_ORIGINAL_ARTICLE_CLICKED,
  payload: {
    articleId,
  },
})

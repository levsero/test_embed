import { settings } from 'service/settings'

import {
  ARTICLE_DISMISSED_PENDING,
  ARTICLE_DISMISSED_FULFILLED,
  ARTICLE_DISMISSED_REJECTED
} from '../action-types'

import {
  getCurrentSessionID,
  getCurrentArticleID,
  getCurrentDeflection,
  getCurrentInteractionToken
} from 'src/redux/modules/answerBot/root/selectors'

import { http } from 'service/transport'

function articleDismissedPending(sessionID, articleID, reasonID) {
  return {
    type: ARTICLE_DISMISSED_PENDING,
    payload: {
      sessionID,
      articleID,
      reasonID
    }
  }
}

function articleDismissedFulfilled(sessionID, articleID, reasonID) {
  return {
    type: ARTICLE_DISMISSED_FULFILLED,
    payload: {
      sessionID,
      articleID,
      reasonID
    }
  }
}

function articleDismissedRejected(error, sessionID, articleID, reasonID) {
  return {
    type: ARTICLE_DISMISSED_REJECTED,
    payload: {
      error,
      sessionID,
      articleID,
      reasonID
    }
  }
}

export const articleDismissed = reasonID => {
  return (dispatch, getState) => {
    const state = getState()
    const sessionID = getCurrentSessionID(state)
    const articleID = getCurrentArticleID(state)
    const deflection = getCurrentDeflection(state)
    const interactionToken = getCurrentInteractionToken(state)

    dispatch(articleDismissedPending(sessionID, articleID, reasonID))

    const callbacks = {
      done: () => {
        dispatch(articleDismissedFulfilled(sessionID, articleID, reasonID))
      },
      fail: err => {
        dispatch(articleDismissedRejected(err, sessionID, articleID, reasonID))
      }
    }

    /* eslint-disable camelcase */
    const params = {
      reason_id: reasonID,
      deflection_id: deflection.id,
      interaction_access_token: interactionToken,
      article_id: articleID,
      resolution_channel_id: settings.get('viaIdAnswerBot')
    }
    /* eslint-enable camelcase */

    http.send({
      callbacks,
      method: 'post',
      path: '/api/v2/answer_bot/rejection',
      params
    })
  }
}

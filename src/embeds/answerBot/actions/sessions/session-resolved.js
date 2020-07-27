import { settings } from 'service/settings'

import {
  SESSION_RESOLVED_PENDING,
  SESSION_RESOLVED_FULFILLED,
  SESSION_RESOLVED_REJECTED
} from './action-types'

import {
  getCurrentArticleID,
  getCurrentSessionID,
  getCurrentDeflection,
  getCurrentInteractionToken
} from 'src/embeds/answerBot/selectors/root'

import { http } from 'service/transport'

function sessionResolvedPending(sessionID, articleID) {
  return {
    type: SESSION_RESOLVED_PENDING,
    payload: {
      sessionID,
      articleID
    }
  }
}

function sessionResolvedFulfilled(sessionID, articleID) {
  return {
    type: SESSION_RESOLVED_FULFILLED,
    payload: {
      sessionID,
      articleID
    }
  }
}

function sessionResolvedRejected(error, sessionID, articleID) {
  return {
    type: SESSION_RESOLVED_REJECTED,
    payload: {
      error,
      sessionID,
      articleID
    }
  }
}

export const sessionResolved = () => {
  return (dispatch, getState) => {
    const state = getState()
    const sessionID = getCurrentSessionID(state)
    const articleID = getCurrentArticleID(state)
    const deflection = getCurrentDeflection(state)
    const interactionToken = getCurrentInteractionToken(state)

    dispatch(sessionResolvedPending(sessionID, articleID))

    const callbacks = {
      done: () => {
        dispatch(sessionResolvedFulfilled(sessionID, articleID))
      },
      fail: err => {
        dispatch(sessionResolvedRejected(err, sessionID, articleID))
      }
    }

    const params = {
      deflection_id: deflection.id,
      article_id: articleID,
      resolution_channel_id: settings.get('viaIdAnswerBot'),
      interaction_access_token: interactionToken
    }

    http.send({
      callbacks,
      method: 'post',
      path: '/api/v2/answer_bot/resolution',
      params
    })
  }
}

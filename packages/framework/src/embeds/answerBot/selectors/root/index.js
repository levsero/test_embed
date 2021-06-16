import _ from 'lodash'

import { createSelector } from 'reselect'
import { getSessionByID, getSessions } from 'src/embeds/answerBot/selectors/sessions'
import {
  getHasContextuallySearched,
  getSearchLoading,
  getResultsCount,
  getArticles,
} from 'embeds/helpCenter/selectors'
import {
  getLastMessageType,
  getGetInTouchVisible,
} from 'src/embeds/answerBot/selectors/conversation'
import { getChannelAvailable } from 'src/redux/modules/selectors'

const getState = (state) => state.answerBot

export const getCurrentSessionID = createSelector([getState], (state) => state.currentSessionID)

export const getQuestionValueChangedTime = createSelector(
  [getState],
  (state) => state.questionValueChangedTime
)

export const getCurrentRequestStatus = createSelector(
  [getCurrentSessionID, getSessions],
  (sessionID, sessions) => {
    const session = sessions && sessions.get(sessionID)

    return session ? session.requestStatus : null
  }
)

export const getCurrentDeflection = createSelector(
  [getCurrentSessionID, getSessions],
  (sessionID, sessions) => {
    const session = sessions && sessions.get(sessionID)

    return session ? session.deflection : null
  }
)

export const getCurrentInteractionToken = createSelector(
  [getCurrentSessionID, getSessions],
  (sessionID, sessions) => {
    const session = sessions && sessions.get(sessionID)

    return session ? session.interactionToken : null
  }
)

export const getCurrentQuery = createSelector(
  [getCurrentSessionID, getSessions],
  (sessionID, sessions) => {
    const session = sessions && sessions.get(sessionID)

    return session ? session.query : null
  }
)

export const isCurrentSessionResolved = createSelector(
  [getCurrentSessionID, getSessions],
  (sessionID, sessions) => {
    const session = sessions && sessions.get(sessionID)

    return !!(session && session.resolved)
  }
)

export const getCurrentArticleID = createSelector(getState, (state) =>
  _.get(state, 'currentArticle.articleID', null)
)

const getCurrentContextualArticleID = createSelector(getState, (state) =>
  _.get(state, 'currentContextualArticle.articleID', null)
)

export const getCurrentArticleSessionID = createSelector([getState], (state) =>
  state.currentArticle ? state.currentArticle.sessionID : null
)

const getCurrentContextualArticle = createSelector(
  [getCurrentContextualArticleID, getArticles],
  (articleID, articles) => (articleID ? articles[articleID] : null)
)

export const getCurrentArticle = createSelector(
  [getCurrentContextualArticle, getCurrentArticleID, getCurrentArticleSessionID, getSessions],
  (contextualArticle, articleID, sessionID, sessions) => {
    if (contextualArticle) return contextualArticle
    const session = sessions && sessions.get(sessionID)
    const articles = (session && session.articles) || []

    return articles.find((article) => {
      return article.id === articleID
    })
  }
)

export const getArticleForArticleAndSessionsID = (state, { sessionID, articleID }) => {
  const sessions = getSessions(state)
  const session = sessions && sessions.get(sessionID)
  const articles = (session && session.articles) || []

  return articles.find((article) => {
    return article.id === articleID
  })
}

export const isFeedbackRequired = createSelector(
  [
    getCurrentContextualArticleID,
    getCurrentArticle,
    getCurrentArticleSessionID,
    getCurrentSessionID,
    isCurrentSessionResolved,
  ],
  (contextual, article, sessionID, currentSessionID, currentSessionResolved) => {
    return (
      !contextual &&
      sessionID === currentSessionID &&
      !currentSessionResolved &&
      !(article && article.markedAsIrrelevant)
    )
  }
)

export const getCurrentScreen = createSelector([getState], (state) => state.currentScreen)

export const getCurrentMessage = createSelector([getState], (state) => state.currentMessage)

export const getGreeted = createSelector([getState], (state) => !!state.greeted)

export const getInitialFallbackSuggested = createSelector(
  [getState],
  (state) => !!state.initialFallbackSuggested
)

export const getContextualSearchFinished = createSelector(
  getState,
  (state) => !!state.contextualSearchFinished
)

export const getContextualSearchStatus = createSelector(
  [getHasContextuallySearched, getSearchLoading, getLastMessageType, getResultsCount],
  (hasContextuallySearched, searchLoading, lastMessageType, resultsCount) => {
    if (!hasContextuallySearched) return null
    if (searchLoading && lastMessageType !== 'botTyping') return 'PENDING'
    if (!searchLoading && resultsCount > 0) return 'COMPLETED'
    if (!searchLoading && resultsCount === 0) return 'NO_RESULTS'
    return null
  }
)

export const getContactButtonVisible = createSelector(
  [getGetInTouchVisible, getChannelAvailable],
  (getInTouchVisible, channelAvailable) => channelAvailable && getInTouchVisible
)

export const getAuthToken = (state) => {
  const sessionId = getCurrentArticleSessionID(state)

  if (!sessionId) {
    return undefined
  }

  const currentSession = getSessionByID(state, sessionId)

  if (!currentSession || !currentSession.deflection) {
    return undefined
  }

  return currentSession.deflection.auth_token
}

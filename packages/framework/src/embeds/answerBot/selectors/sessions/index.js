import { createSelector } from 'reselect'

const getCurrentSessionID = (state) => state.answerBot.currentSessionID

export const getSessions = (state) => state.answerBot.sessions
export const getSessionByID = (state, id) =>
  state.answerBot.sessions && state.answerBot.sessions.get(id)

export const isInitialSession = createSelector([getSessions], (sessions) => sessions.size === 1)

export const getSessionFallbackSuggested = createSelector(
  [getCurrentSessionID, getSessions],
  (sessionID, sessions) => {
    const session = sessions && sessions.get(sessionID)

    return !!(session && session.fallbackSuggested)
  }
)

export const getSessionArticlesLength = createSelector(
  [getCurrentSessionID, getSessions],
  (sessionID, sessions) => {
    const session = sessions && sessions.get(sessionID)

    return (session && session.articles && session.articles.length) || 0
  }
)

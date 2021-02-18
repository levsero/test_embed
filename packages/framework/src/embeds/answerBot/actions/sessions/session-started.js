import { SESSION_STARTED } from './action-types'

const generateSessionID = () => Date.now()

const generateSessionData = () => ({
  resolved: false,
  fallbackSuggested: false,
  requestStatus: null,
  articles: [],
})

export const sessionStarted = () => {
  return {
    type: SESSION_STARTED,
    payload: {
      sessionID: generateSessionID(),
      sessionData: generateSessionData(),
    },
  }
}

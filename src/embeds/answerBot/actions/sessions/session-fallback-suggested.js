import { SESSION_FALLBACK } from './action-types'

import { getCurrentSessionID } from 'src/embeds/answerBot/selectors/root'

export const sessionFallback = () => {
  return (dispatch, getState) => {
    dispatch({
      type: SESSION_FALLBACK,
      payload: {
        sessionID: getCurrentSessionID(getState())
      }
    })
  }
}

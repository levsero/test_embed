import { getCurrentSessionID } from 'src/embeds/answerBot/selectors/root'
import { SESSION_FALLBACK } from './action-types'

export const sessionFallback = () => {
  return (dispatch, getState) => {
    dispatch({
      type: SESSION_FALLBACK,
      payload: {
        sessionID: getCurrentSessionID(getState()),
      },
    })
  }
}
